<?php
/**
 * Plugin Name: SSBA Reason Manager
 * Description: SSBA 選ばれる理由ページの管理と REST API 提供
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
        header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type' );
        return $value;
    } );
}, 15 );

/* -------------------------------------------------------
 * 管理画面メニュー（オプションページ）
 * ------------------------------------------------------- */
add_action( 'admin_menu', function () {
    add_menu_page(
        '選ばれる理由',
        '選ばれる理由',
        'manage_options',
        'ssba_reason',
        'ssba_reason_page_html',
        'dashicons-star-filled',
        24
    );
} );

function ssba_reason_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) return;

    // 保存処理
    if ( isset( $_POST['ssba_reason_save'] ) && check_admin_referer( 'ssba_reason_save' ) ) {
        $fields = [
            'ssba_reason_lead'     => 'textarea',
            'ssba_reason_sections' => 'raw',    // JSON
            'ssba_reason_bullets'  => 'textarea',
            'ssba_reason_hero_url' => 'text',
        ];
        update_option( 'ssba_reason_lead',     sanitize_textarea_field( wp_unslash( $_POST['ssba_reason_lead'] ?? '' ) ) );
        update_option( 'ssba_reason_hero_url', esc_url_raw( wp_unslash( $_POST['ssba_reason_hero_url'] ?? '' ) ) );
        update_option( 'ssba_reason_bullets',  sanitize_textarea_field( wp_unslash( $_POST['ssba_reason_bullets'] ?? '' ) ) );

        // sections JSON バリデート
        $sections_raw = wp_unslash( $_POST['ssba_reason_sections'] ?? '' );
        $decoded = json_decode( $sections_raw, true );
        if ( json_last_error() === JSON_ERROR_NONE ) {
            update_option( 'ssba_reason_sections', json_encode( $decoded, JSON_UNESCAPED_UNICODE ) );
            echo '<div class="notice notice-success"><p>保存しました。</p></div>';
        } else {
            echo '<div class="notice notice-error"><p>セクションのJSONが無効です。保存されませんでした。</p></div>';
        }
    }

    $lead     = get_option( 'ssba_reason_lead', '' );
    $hero_url = get_option( 'ssba_reason_hero_url', '' );
    $bullets  = get_option( 'ssba_reason_bullets', '' );
    $sections = get_option( 'ssba_reason_sections', '' );

    $sections_example = json_encode( [
        [
            'title' => '基本を徹底することが、上達への最短ルート',
            'paragraphs' => [
                '私はこれまで、多くのプロ野球選手と共にプレーし、練習を重ねてきました。',
                'その中で強く感じたのは、一流の選手ほど基本を大切にしているということです。',
            ],
        ],
        [
            'title' => '一人ひとりに寄り添った指導',
            'paragraphs' => [
                '当塾では、生徒一人ひとりとのコミュニケーションを大切にし指導を行います。',
            ],
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );
    ?>
    <div class="wrap">
        <h1>選ばれる理由 ページ編集</h1>
        <form method="post">
            <?php wp_nonce_field( 'ssba_reason_save' ); ?>
            <input type="hidden" name="ssba_reason_save" value="1">

            <h2>ヘッダー画像URL</h2>
            <p><input type="url" name="ssba_reason_hero_url" value="<?php echo esc_attr( $hero_url ); ?>" style="width:100%;max-width:600px" placeholder="https://..."></p>
            <p class="description">WordPressメディアライブラリからURLをコピーして貼り付けてください。</p>

            <h2>リード文</h2>
            <textarea name="ssba_reason_lead" style="width:100%;height:100px;max-width:800px"><?php echo esc_textarea( $lead ); ?></textarea>

            <h2>このような方に選ばれています（箇条書き・1行1項目）</h2>
            <textarea name="ssba_reason_bullets" style="width:100%;height:120px;max-width:800px;font-family:monospace"><?php echo esc_textarea( $bullets ); ?></textarea>

            <h2>セクション（JSON形式）</h2>
            <textarea name="ssba_reason_sections" style="width:100%;height:300px;max-width:800px;font-family:monospace"><?php echo esc_textarea( $sections ); ?></textarea>
            <details style="margin-top:8px"><summary style="cursor:pointer;color:#0073aa">入力例を見る</summary>
                <pre style="background:#f0f0f0;padding:12px;font-size:11px;overflow:auto;max-width:800px"><?php echo esc_html( $sections_example ); ?></pre>
            </details>

            <?php submit_button( '保存する', 'primary', 'submit', false ); ?>
        </form>
    </div>
    <?php
}

/* -------------------------------------------------------
 * REST API
 * GET /wp-json/ssba/v1/reason
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/reason', [
        'methods'             => 'GET',
        'callback'            => 'ssba_reason_get',
        'permission_callback' => '__return_true',
    ] );
} );

function ssba_reason_get() {
    $bullets_raw = get_option( 'ssba_reason_bullets', '' );
    $bullets     = array_values( array_filter( array_map( 'trim', explode( "\n", $bullets_raw ) ) ) );
    $sections_raw = get_option( 'ssba_reason_sections', '' );
    $sections_decoded = $sections_raw ? json_decode( wp_unslash( $sections_raw ), true ) : null;
    $sections = is_array( $sections_decoded ) ? $sections_decoded : [];

    return rest_ensure_response( [
        'heroUrl'  => get_option( 'ssba_reason_hero_url', '' ),
        'lead'     => get_option( 'ssba_reason_lead', '' ),
        'bullets'  => $bullets,
        'sections' => $sections,
    ] );
}
