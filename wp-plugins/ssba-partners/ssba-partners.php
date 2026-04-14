<?php
/**
 * Plugin Name: SSBA Partners Manager
 * Description: SSBA 関連団体（バナー）の管理と REST API 提供
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
        header( 'Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, X-SSBA-Admin-Key' );
        return $value;
    } );
}, 15 );

/* -------------------------------------------------------
 * デフォルトデータ
 * ------------------------------------------------------- */
register_activation_hook( __FILE__, 'ssba_partners_activate' );

function ssba_partners_activate() {
    if ( get_option( 'ssba_partners_data' ) ) return;
    $default = [
        'partners' => [
            [ 'id' => 1, 'src' => '', 'alt' => 'バナー1', 'href' => '#' ],
            [ 'id' => 2, 'src' => '', 'alt' => 'バナー2', 'href' => '#' ],
            [ 'id' => 3, 'src' => '', 'alt' => 'バナー3', 'href' => '#' ],
            [ 'id' => 4, 'src' => '', 'alt' => 'バナー4', 'href' => '#' ],
        ],
    ];
    update_option( 'ssba_partners_data', json_encode( $default, JSON_UNESCAPED_UNICODE ) );
}

/* -------------------------------------------------------
 * 管理画面メニュー
 * ------------------------------------------------------- */
add_action( 'admin_menu', function () {
    add_menu_page(
        '関連団体',
        '関連団体',
        'manage_options',
        'ssba_partners',
        'ssba_partners_page_html',
        'dashicons-networking',
        26
    );
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
    if ( $hook !== 'toplevel_page_ssba_partners' ) return;
    wp_enqueue_media();
} );

function ssba_partners_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) return;

    // 保存処理
    if ( isset( $_POST['ssba_partners_save'] ) && check_admin_referer( 'ssba_partners_save' ) ) {
        $ids   = $_POST['partner_id']   ?? [];
        $srcs  = $_POST['partner_src']  ?? [];
        $alts  = $_POST['partner_alt']  ?? [];
        $hrefs = $_POST['partner_href'] ?? [];

        $partners = [];
        foreach ( $ids as $i => $id ) {
            $src = esc_url_raw( wp_unslash( $srcs[ $i ] ?? '' ) );
            if ( $src === '' ) continue; // 画像なしはスキップ
            $partners[] = [
                'id'   => (int) $id,
                'src'  => $src,
                'alt'  => sanitize_text_field( wp_unslash( $alts[ $i ] ?? '' ) ),
                'href' => esc_url_raw( wp_unslash( $hrefs[ $i ] ?? '#' ) ),
            ];
        }

        // 新規追加行
        $new_src  = esc_url_raw( wp_unslash( $_POST['new_partner_src'] ?? '' ) );
        $new_alt  = sanitize_text_field( wp_unslash( $_POST['new_partner_alt'] ?? '' ) );
        $new_href = esc_url_raw( wp_unslash( $_POST['new_partner_href'] ?? '#' ) );
        if ( $new_src !== '' ) {
            $max_id    = ! empty( $partners ) ? max( array_column( $partners, 'id' ) ) : 0;
            $partners[] = [
                'id'   => $max_id + 1,
                'src'  => $new_src,
                'alt'  => $new_alt,
                'href' => $new_href ?: '#',
            ];
        }

        update_option( 'ssba_partners_data', json_encode( [ 'partners' => $partners ], JSON_UNESCAPED_UNICODE ) );
        echo '<div class="notice notice-success"><p>保存しました。</p></div>';
    }

    $json     = get_option( 'ssba_partners_data', '{"partners":[]}' );
    $data     = json_decode( $json, true );
    $partners = $data['partners'] ?? [];
    ?>
    <div class="wrap">
        <h1>関連団体 バナー管理</h1>
        <p style="color:#666">「メディアを選択」ボタンでメディアライブラリから画像を挿入できます。「削除」ボタンで行を除去してから保存してください。</p>
        <form method="post">
            <?php wp_nonce_field( 'ssba_partners_save' ); ?>
            <input type="hidden" name="ssba_partners_save" value="1">
            <table class="widefat fixed" style="margin-bottom:16px">
                <thead>
                    <tr>
                        <th style="width:40px">ID</th>
                        <th>画像</th>
                        <th style="width:150px">alt テキスト</th>
                        <th style="width:190px">リンク先URL</th>
                        <th style="width:70px">削除</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( $partners as $p ) : ?>
                    <tr class="ssba-partner-row">
                        <input type="hidden" name="partner_id[]" value="<?php echo esc_attr( $p['id'] ); ?>">
                        <td style="vertical-align:middle"><?php echo esc_html( $p['id'] ); ?></td>
                        <td>
                            <div class="ssba-preview-wrap" style="margin-bottom:6px;<?php echo $p['src'] ? '' : 'display:none;'; ?>">
                                <img src="<?php echo esc_url( $p['src'] ); ?>" class="ssba-preview-img" style="max-height:50px;max-width:140px;display:block;border:1px solid #ddd;padding:2px">
                            </div>
                            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                                <button type="button" class="button ssba-media-btn">メディアを選択</button>
                                <button type="button" class="button ssba-clear-btn" style="color:#dc2626;border-color:#dc2626;<?php echo $p['src'] ? '' : 'display:none;'; ?>">✕ クリア</button>
                            </div>
                            <input type="hidden" name="partner_src[]" value="<?php echo esc_attr( $p['src'] ); ?>" class="ssba-src-input">
                        </td>
                        <td><input type="text" name="partner_alt[]" value="<?php echo esc_attr( $p['alt'] ); ?>" style="width:100%"></td>
                        <td><input type="url" name="partner_href[]" value="<?php echo esc_attr( $p['href'] ); ?>" style="width:100%" placeholder="https://..."></td>
                        <td style="text-align:center;vertical-align:middle">
                            <button type="button" class="button ssba-delete-row-btn" style="color:#dc2626;border-color:#dc2626">削除</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <tr style="background:#f0f7ff" class="ssba-partner-row">
                        <td style="vertical-align:middle"><strong>新規</strong></td>
                        <td>
                            <div class="ssba-preview-wrap" style="margin-bottom:6px;display:none;">
                                <img src="" class="ssba-preview-img" style="max-height:50px;max-width:140px;display:block;border:1px solid #ddd;padding:2px">
                            </div>
                            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                                <button type="button" class="button ssba-media-btn">メディアを選択</button>
                                <button type="button" class="button ssba-clear-btn" style="color:#dc2626;border-color:#dc2626;display:none;">✕ クリア</button>
                            </div>
                            <input type="hidden" name="new_partner_src" value="" class="ssba-src-input">
                        </td>
                        <td><input type="text" name="new_partner_alt" value="" style="width:100%" placeholder="alt テキスト"></td>
                        <td><input type="url" name="new_partner_href" value="" style="width:100%" placeholder="https://..."></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <?php submit_button( '保存する', 'primary', 'submit', false ); ?>
        </form>
    </div>

    <script>
    (function($) {
        // メディアピッカーを開く
        $(document).on('click', '.ssba-media-btn', function(e) {
            e.preventDefault();
            var $row  = $(this).closest('tr');
            var $src  = $row.find('.ssba-src-input');
            var $wrap = $row.find('.ssba-preview-wrap');
            var $img  = $row.find('.ssba-preview-img');
            var $clr  = $row.find('.ssba-clear-btn');

            var frame = wp.media({
                title:    '画像を選択',
                button:   { text: '選択' },
                multiple: false,
                library:  { type: 'image' },
            });
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                $src.val(attachment.url);
                $img.attr('src', attachment.url);
                $wrap.show();
                $clr.show();
            });
            frame.open();
        });

        // 画像をクリア
        $(document).on('click', '.ssba-clear-btn', function(e) {
            e.preventDefault();
            var $row = $(this).closest('tr');
            $row.find('.ssba-src-input').val('');
            $row.find('.ssba-preview-wrap').hide();
            $row.find('.ssba-preview-img').attr('src', '');
            $(this).hide();
        });

        // 行を削除（DOMから除去してから保存）
        $(document).on('click', '.ssba-delete-row-btn', function(e) {
            e.preventDefault();
            if ( confirm('この行を削除しますか？') ) {
                $(this).closest('tr').remove();
            }
        });
    })(jQuery);
    </script>
    <?php
}

// 管理キー認証
if ( ! defined( 'SSBA_ADMIN_KEY' ) ) {
    define( 'SSBA_ADMIN_KEY', 'ssba1223' );
}
function ssba_partners_check_key( WP_REST_Request $request ) {
    return $request->get_header( 'X-SSBA-Admin-Key' ) === SSBA_ADMIN_KEY;
}

/* -------------------------------------------------------
 * REST API
 * GET  /wp-json/ssba/v1/partners
 * PUT  /wp-json/ssba/v1/partners
 * POST /wp-json/ssba/v1/partners/upload
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/partners', [
        [
            'methods'             => 'GET',
            'callback'            => 'ssba_partners_get',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => 'PUT',
            'callback'            => 'ssba_partners_put',
            'permission_callback' => 'ssba_partners_check_key',
        ],
    ] );
    register_rest_route( 'ssba/v1', '/partners/upload', [
        'methods'             => 'POST',
        'callback'            => 'ssba_partners_upload',
        'permission_callback' => 'ssba_partners_check_key',
    ] );
} );

function ssba_partners_get() {
    $json = get_option( 'ssba_partners_data', '{"partners":[]}' );
    return rest_ensure_response( json_decode( $json, true ) );
}

function ssba_partners_put( WP_REST_Request $request ) {
    $body = $request->get_json_params();
    if ( ! isset( $body['partners'] ) || ! is_array( $body['partners'] ) ) {
        return new WP_Error( 'invalid_data', '不正なデータです', [ 'status' => 400 ] );
    }
    update_option( 'ssba_partners_data', json_encode( $body, JSON_UNESCAPED_UNICODE ) );
    return rest_ensure_response( [ 'ok' => true ] );
}

function ssba_partners_upload( WP_REST_Request $request ) {
    $body     = $request->get_json_params();
    $filename = sanitize_file_name( $body['filename'] ?? 'banner.jpg' );
    $data_url = $body['data'] ?? '';

    if ( ! preg_match( '/^data:(image\/(jpeg|png|webp|gif|svg\+xml));base64,/', $data_url, $m ) ) {
        return new WP_Error( 'invalid_file', '対応していないファイル形式です', [ 'status' => 400 ] );
    }

    $base64   = preg_replace( '/^data:image\/[a-z+]+;base64,/', '', $data_url );
    $decoded  = base64_decode( $base64 );

    if ( strlen( $decoded ) > 5 * 1024 * 1024 ) {
        return new WP_Error( 'too_large', 'ファイルサイズが大きすぎます（最大5MB）', [ 'status' => 400 ] );
    }

    $upload_dir = wp_upload_dir();
    $file_path  = trailingslashit( $upload_dir['path'] ) . $filename;
    file_put_contents( $file_path, $decoded );

    $url = trailingslashit( $upload_dir['url'] ) . $filename;
    return rest_ensure_response( [ 'url' => $url ] );
}
