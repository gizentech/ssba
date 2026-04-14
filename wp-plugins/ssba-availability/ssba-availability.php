<?php
/**
 * Plugin Name: SSBA Availability Manager
 * Description: SSBA アカデミー空き状況の管理と REST API 提供
 * Version: 1.0.0
 * Author: SSBA
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* -------------------------------------------------------
 * CORS
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $value ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: GET, PUT, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, X-WP-Nonce, X-SSBA-Admin-Key' );
        return $value;
    } );
}, 15 );

/* -------------------------------------------------------
 * デフォルトデータ（初回インストール時に投入）
 * ------------------------------------------------------- */
register_activation_hook( __FILE__, 'ssba_availability_activate' );

function ssba_availability_activate() {
    if ( get_option( 'ssba_availability_data' ) ) return; // 既存データがあればスキップ

    $default = [
        'classes' => [
            [ 'id' => 'elementary',    'name' => '小学生クラス',    'subtitle' => '17:15〜18:35',            'schedule' => '', 'days' => [ 'mon' => '○', 'tue' => '○', 'wed' => '○', 'thu' => '○', 'fri' => '○', 'sat' => '×' ] ],
            [ 'id' => 'junior-high',   'name' => '中学生クラス',    'subtitle' => '18:45〜20:10',            'schedule' => '', 'days' => [ 'mon' => '○', 'tue' => '×', 'wed' => '×', 'thu' => '○', 'fri' => '○', 'sat' => '×' ] ],
            [ 'id' => 'high-level',    'name' => 'ハイレベルクラス','subtitle' => '小学6年生限定 / 18:45〜20:10', 'schedule' => '', 'days' => [ 'mon' => '△', 'tue' => '△', 'wed' => '○', 'thu' => '×', 'fri' => '×', 'sat' => '×' ] ],
            [ 'id' => 'junior-high-3', 'name' => '中学3年生クラス','subtitle' => '9月〜3月のみ / 17:00〜19:00', 'schedule' => '', 'days' => [ 'mon' => '×', 'tue' => '×', 'wed' => '×', 'thu' => '×', 'fri' => '×', 'sat' => '○' ] ],
            [ 'id' => 'new-class',     'name' => '新設クラス',      'subtitle' => '準備中',                  'schedule' => '', 'days' => [ 'mon' => '−', 'tue' => '−', 'wed' => '−', 'thu' => '−', 'fri' => '−', 'sat' => '−' ] ],
        ],
    ];
    update_option( 'ssba_availability_data', json_encode( $default, JSON_UNESCAPED_UNICODE ) );
}

/* -------------------------------------------------------
 * 管理画面メニュー
 * ------------------------------------------------------- */
add_action( 'admin_menu', function () {
    add_menu_page(
        'アカデミー空き状況',
        '空き状況',
        'manage_options',
        'ssba_availability',
        'ssba_availability_page_html',
        'dashicons-calendar-alt',
        25
    );
} );

function ssba_availability_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) return;

    // 保存処理
    if ( isset( $_POST['ssba_avail_save'] ) && check_admin_referer( 'ssba_avail_save' ) ) {
        $classes = [];
        $ids      = $_POST['avail_id']       ?? [];
        $names    = $_POST['avail_name']     ?? [];
        $subtitles = $_POST['avail_subtitle'] ?? [];
        $days_keys = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];

        foreach ( $ids as $i => $id ) {
            $days = [];
            foreach ( $days_keys as $d ) {
                $days[ $d ] = sanitize_text_field( $_POST[ 'avail_' . $d ][ $i ] ?? '−' );
            }
            $classes[] = [
                'id'       => sanitize_text_field( $id ),
                'name'     => sanitize_text_field( $names[ $i ] ?? '' ),
                'subtitle' => sanitize_text_field( $subtitles[ $i ] ?? '' ),
                'schedule' => '',
                'days'     => $days,
            ];
        }

        $data = [ 'classes' => $classes ];
        update_option( 'ssba_availability_data', json_encode( $data, JSON_UNESCAPED_UNICODE ) );
        echo '<div class="notice notice-success"><p>保存しました。</p></div>';
    }

    $json    = get_option( 'ssba_availability_data', '{"classes":[]}' );
    $data    = json_decode( $json, true );
    $classes = $data['classes'] ?? [];
    $days_labels = [ 'mon' => '月', 'tue' => '火', 'wed' => '水', 'thu' => '木', 'fri' => '金', 'sat' => '土' ];
    $status_opts = [ '○', '△', '×', '−' ];
    ?>
    <div class="wrap">
        <h1>アカデミー空き状況</h1>
        <p>○ = 空きあり　△ = 残りわずか　× = 満員　− = クラスなし</p>
        <form method="post">
            <?php wp_nonce_field( 'ssba_avail_save' ); ?>
            <input type="hidden" name="ssba_avail_save" value="1">
            <table class="widefat fixed" style="margin-bottom:16px">
                <thead>
                    <tr>
                        <th style="width:80px">ID</th>
                        <th style="width:160px">クラス名</th>
                        <th>サブタイトル（時間帯など）</th>
                        <?php foreach ( $days_labels as $key => $label ) : ?>
                            <th style="width:60px;text-align:center"><?php echo esc_html( $label ); ?></th>
                        <?php endforeach; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( $classes as $i => $cls ) : ?>
                    <tr>
                        <td><input type="text" name="avail_id[]" value="<?php echo esc_attr( $cls['id'] ); ?>" style="width:100%;font-size:11px"></td>
                        <td><input type="text" name="avail_name[]" value="<?php echo esc_attr( $cls['name'] ); ?>" style="width:100%"></td>
                        <td><input type="text" name="avail_subtitle[]" value="<?php echo esc_attr( $cls['subtitle'] ); ?>" style="width:100%"></td>
                        <?php foreach ( $days_labels as $dkey => $dlabel ) : ?>
                        <td style="text-align:center">
                            <select name="avail_<?php echo esc_attr( $dkey ); ?>[]" style="width:54px">
                                <?php foreach ( $status_opts as $opt ) : ?>
                                    <option value="<?php echo esc_attr( $opt ); ?>" <?php selected( $cls['days'][ $dkey ] ?? '−', $opt ); ?>><?php echo esc_html( $opt ); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                        <?php endforeach; ?>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php submit_button( '保存する', 'primary', 'submit', false ); ?>
        </form>

        <hr>
        <h2>現在のデータ（JSON）</h2>
        <pre style="background:#f0f0f0;padding:12px;font-size:12px;overflow:auto"><?php echo esc_html( json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT ) ); ?></pre>
    </div>
    <?php
}

/* -------------------------------------------------------
 * REST API
 * GET  /wp-json/ssba/v1/availability
 * PUT  /wp-json/ssba/v1/availability  （管理者のみ）
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/availability', [
        [
            'methods'             => 'GET',
            'callback'            => 'ssba_availability_get',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => 'PUT',
            'callback'            => 'ssba_availability_put',
            'permission_callback' => 'ssba_availability_check_key',
        ],
    ] );
} );

function ssba_availability_check_key( WP_REST_Request $request ) {
    $key = $request->get_header( 'X-SSBA-Admin-Key' );
    return $key === SSBA_ADMIN_KEY;
}

// シークレットキー（wp-config.php で上書き可能）
if ( ! defined( 'SSBA_ADMIN_KEY' ) ) {
    define( 'SSBA_ADMIN_KEY', 'ssba1223' );
}

function ssba_availability_get() {
    $json = get_option( 'ssba_availability_data', '{"classes":[]}' );
    return rest_ensure_response( json_decode( $json, true ) );
}

function ssba_availability_put( $request ) {
    $body = $request->get_json_params();
    if ( ! isset( $body['classes'] ) || ! is_array( $body['classes'] ) ) {
        return new WP_Error( 'invalid_data', '不正なデータです', [ 'status' => 400 ] );
    }
    update_option( 'ssba_availability_data', json_encode( $body, JSON_UNESCAPED_UNICODE ) );
    return rest_ensure_response( [ 'ok' => true ] );
}
