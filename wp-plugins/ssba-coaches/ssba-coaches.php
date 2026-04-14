<?php
/**
 * Plugin Name: SSBA Coaches Manager
 * Description: SSBA 指導者紹介（プロフィール・球歴・ご挨拶）の管理と REST API 提供
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
 * カスタム投稿タイプ登録
 * ------------------------------------------------------- */
add_action( 'init', function () {
    register_post_type( 'ssba_coach', [
        'labels' => [
            'name'          => '指導者紹介',
            'singular_name' => '指導者',
            'add_new_item'  => '指導者を追加',
            'edit_item'     => '指導者を編集',
            'all_items'     => '指導者一覧',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => false,
        'supports'      => [ 'title', 'thumbnail' ],
        'menu_icon'     => 'dashicons-groups',
        'menu_position' => 23,
    ] );
} );

/* -------------------------------------------------------
 * メタボックス
 * ------------------------------------------------------- */
add_action( 'admin_enqueue_scripts', function ( $hook ) {
    if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ] ) ) return;
    $screen = get_current_screen();
    if ( ! $screen || $screen->post_type !== 'ssba_coach' ) return;
    wp_enqueue_media();
} );

add_action( 'add_meta_boxes', function () {
    add_meta_box( 'ssba_coach_basic',   '基本情報',   'ssba_coach_basic_html',   'ssba_coach', 'normal', 'high' );
    add_meta_box( 'ssba_coach_profile', 'プロフィール（経歴）', 'ssba_coach_profile_html', 'ssba_coach', 'normal', 'high' );
    add_meta_box( 'ssba_coach_career',  '主な球歴',   'ssba_coach_career_html',  'ssba_coach', 'normal', 'default' );
    add_meta_box( 'ssba_coach_greeting','ご挨拶文',   'ssba_coach_greeting_html','ssba_coach', 'normal', 'default' );
    add_meta_box( 'ssba_coach_gallery', 'ギャラリー画像', 'ssba_coach_gallery_html', 'ssba_coach', 'side', 'default' );
} );

function ssba_coach_basic_html( $post ) {
    wp_nonce_field( 'ssba_coach_save', 'ssba_coach_nonce' );
    $fields = [
        'ssba_coach_role'    => '役職（例：代表 / ヘッドコーチ）',
        'ssba_coach_name'    => '氏名（例：流 大輔）',
        'ssba_coach_name_en' => '氏名英語（例：Daisuke Nagare）',
        'ssba_coach_order'   => '表示順（数字）',
    ];
    echo '<table style="width:100%;border-collapse:collapse">';
    foreach ( $fields as $key => $label ) {
        $value = get_post_meta( $post->ID, $key, true );
        echo '<tr><td style="padding:8px 4px;width:200px"><strong>' . esc_html( $label ) . '</strong></td>';
        echo '<td style="padding:8px 4px"><input type="text" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '" style="width:100%"></td></tr>';
    }
    echo '</table>';
    echo '<p style="color:#888;font-size:12px">※ アイキャッチ画像がメインプロフィール写真になります。</p>';
}

function ssba_coach_profile_html( $post ) {
    $value = get_post_meta( $post->ID, 'ssba_coach_profile', true );
    echo '<p style="color:#888;font-size:12px">1行1項目で入力してください。ネストは行頭に「  」（半角スペース2つ）を付けてください。</p>';
    echo '<textarea name="ssba_coach_profile" style="width:100%;height:160px;font-family:monospace">' . esc_textarea( $value ) . '</textarea>';
    echo '<p style="color:#888;font-size:12px">例：<br>福岡県久留米市出身 1989/3/11生まれ<br>祐誠高校<br>プロ野球独立リーグ 四国アイランドリーグ plus<br>  高知ファイティングドッグス 2008〜2011<br>  愛媛マンダリンパイレーツ 2012〜同年引退</p>';
}

function ssba_coach_career_html( $post ) {
    $value = get_post_meta( $post->ID, 'ssba_coach_career_json', true );
    echo '<p style="color:#888;font-size:12px">JSON形式で入力してください。</p>';
    echo '<textarea name="ssba_coach_career_json" style="width:100%;height:220px;font-family:monospace">' . esc_textarea( $value ) . '</textarea>';
    $example = json_encode( [
        [
            'subtitle' => '祐誠高校 時代',
            'items'    => [ '2004年秋季高校野球福岡県大会3位', '2004年秋季高校野球九州大会出場' ],
        ],
        [
            'subtitle' => 'プロ野球独立リーグ四国アイランドリーグ時代',
            'teams'    => [
                [
                    'name'  => '高知ファイティングドッグス 2008年〜2011年',
                    'items' => [ '2009年独立リーグ日本一', '2011年最多盗塁王 通算128盗塁' ],
                ],
            ],
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );
    echo '<details style="margin-top:8px"><summary style="cursor:pointer;color:#0073aa">入力例を見る</summary><pre style="background:#f0f0f0;padding:8px;font-size:11px;overflow:auto">' . esc_html( $example ) . '</pre></details>';
}

function ssba_coach_greeting_html( $post ) {
    $value = get_post_meta( $post->ID, 'ssba_coach_greeting', true );
    echo '<textarea name="ssba_coach_greeting" style="width:100%;height:200px">' . esc_textarea( $value ) . '</textarea>';
}

function ssba_coach_gallery_html( $post ) {
    $raw  = get_post_meta( $post->ID, 'ssba_coach_gallery', true );
    $urls = array_values( array_filter( array_map( 'trim', explode( "\n", $raw ) ) ) );
    ?>
    <p style="color:#888;font-size:12px;margin-top:0">メインプロフィール写真はアイキャッチ画像で設定してください。</p>
    <div id="ssba-gallery-list" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;min-height:20px">
        <?php foreach ( $urls as $url ) : ?>
            <div class="ssba-gallery-item" style="position:relative;width:72px">
                <img src="<?php echo esc_url( $url ); ?>" style="width:72px;height:72px;object-fit:cover;border:1px solid #ddd;display:block">
                <button type="button" class="ssba-gallery-remove" title="削除"
                    style="position:absolute;top:2px;right:2px;background:#dc2626;color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:11px;line-height:18px;cursor:pointer;padding:0;text-align:center">✕</button>
                <input type="hidden" class="ssba-gallery-url" value="<?php echo esc_attr( $url ); ?>">
            </div>
        <?php endforeach; ?>
    </div>
    <button type="button" class="button" id="ssba-gallery-add-btn">＋ メディアから追加</button>
    <input type="hidden" name="ssba_coach_gallery" id="ssba_coach_gallery_hidden" value="<?php echo esc_attr( $raw ); ?>">

    <script>
    (function($) {
        function syncHidden() {
            var urls = [];
            $('#ssba-gallery-list .ssba-gallery-url').each(function() {
                urls.push($(this).val());
            });
            $('#ssba_coach_gallery_hidden').val(urls.join('\n'));
        }

        $('#ssba-gallery-add-btn').on('click', function(e) {
            e.preventDefault();
            var frame = wp.media({
                title:    'ギャラリー画像を選択',
                button:   { text: '追加' },
                multiple: true,
                library:  { type: 'image' },
            });
            frame.on('select', function() {
                frame.state().get('selection').each(function(attachment) {
                    var url = attachment.toJSON().url;
                    var $item = $('<div class="ssba-gallery-item" style="position:relative;width:72px">' +
                        '<img src="' + url + '" style="width:72px;height:72px;object-fit:cover;border:1px solid #ddd;display:block">' +
                        '<button type="button" class="ssba-gallery-remove" title="削除" style="position:absolute;top:2px;right:2px;background:#dc2626;color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:11px;line-height:18px;cursor:pointer;padding:0;text-align:center">✕</button>' +
                        '<input type="hidden" class="ssba-gallery-url" value="' + url + '">' +
                        '</div>');
                    $('#ssba-gallery-list').append($item);
                });
                syncHidden();
            });
            frame.open();
        });

        $(document).on('click', '.ssba-gallery-remove', function(e) {
            e.preventDefault();
            $(this).closest('.ssba-gallery-item').remove();
            syncHidden();
        });
    })(jQuery);
    </script>
    <?php
}

add_action( 'save_post_ssba_coach', function ( $post_id ) {
    if ( ! isset( $_POST['ssba_coach_nonce'] ) || ! wp_verify_nonce( $_POST['ssba_coach_nonce'], 'ssba_coach_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $text_fields = [ 'ssba_coach_role', 'ssba_coach_name', 'ssba_coach_name_en', 'ssba_coach_order' ];
    foreach ( $text_fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
        }
    }

    $textarea_fields = [ 'ssba_coach_profile', 'ssba_coach_greeting', 'ssba_coach_gallery' ];
    foreach ( $textarea_fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) );
        }
    }

    // career JSON: 保存前にバリデート
    if ( isset( $_POST['ssba_coach_career_json'] ) ) {
        $json_raw = wp_unslash( $_POST['ssba_coach_career_json'] );
        $decoded  = json_decode( $json_raw, true );
        if ( json_last_error() === JSON_ERROR_NONE ) {
            update_post_meta( $post_id, 'ssba_coach_career_json', wp_slash( json_encode( $decoded, JSON_UNESCAPED_UNICODE ) ) );
        }
        // 無効なJSONは保存しない（既存値を維持）
    }
} );

/* -------------------------------------------------------
 * REST API
 * GET /wp-json/ssba/v1/coaches
 * GET /wp-json/ssba/v1/coaches/{id}
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/coaches', [
        'methods'             => 'GET',
        'callback'            => 'ssba_coaches_get_all',
        'permission_callback' => '__return_true',
    ] );
    register_rest_route( 'ssba/v1', '/coaches/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'ssba_coaches_get_single',
        'permission_callback' => '__return_true',
        'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
    ] );
} );

function ssba_coaches_format( $post ) {
    $photo_url = '';
    if ( has_post_thumbnail( $post->ID ) ) {
        $photo_url = get_the_post_thumbnail_url( $post->ID, 'full' );
    }

    // ギャラリー: 改行区切りURLを配列に
    $gallery_raw = get_post_meta( $post->ID, 'ssba_coach_gallery', true );
    $gallery     = array_values( array_filter( array_map( 'trim', explode( "\n", $gallery_raw ) ) ) );

    // プロフィール: 改行区切りをパースしてネスト構造に
    $profile_raw = get_post_meta( $post->ID, 'ssba_coach_profile', true );
    $profile     = ssba_coaches_parse_profile( $profile_raw );

    // 球歴: JSON
    $career_json = get_post_meta( $post->ID, 'ssba_coach_career_json', true );
    $career      = $career_json ? json_decode( $career_json, true ) : [];

    return [
        'id'       => $post->ID,
        'name'     => get_post_meta( $post->ID, 'ssba_coach_name', true ) ?: $post->post_title,
        'nameEn'   => get_post_meta( $post->ID, 'ssba_coach_name_en', true ),
        'role'     => get_post_meta( $post->ID, 'ssba_coach_role', true ),
        'photo'    => $photo_url,
        'gallery'  => $gallery,
        'profile'  => $profile,
        'career'   => $career,
        'greeting' => get_post_meta( $post->ID, 'ssba_coach_greeting', true ),
        'order'    => (int) get_post_meta( $post->ID, 'ssba_coach_order', true ),
    ];
}

/**
 * 改行テキストをパースしてリスト構造に変換
 * 先頭スペース2つ = サブアイテム
 */
function ssba_coaches_parse_profile( $raw ) {
    $lines  = explode( "\n", $raw );
    $result = [];
    foreach ( $lines as $line ) {
        $line = rtrim( $line );
        if ( $line === '' ) continue;
        if ( substr( $line, 0, 2 ) === '  ' ) {
            // サブアイテム: 直前の親に追加
            if ( ! empty( $result ) ) {
                $last = count( $result ) - 1;
                if ( ! isset( $result[ $last ]['children'] ) ) {
                    $result[ $last ]['children'] = [];
                }
                $result[ $last ]['children'][] = trim( $line );
            }
        } else {
            $result[] = [ 'text' => $line ];
        }
    }
    return $result;
}

function ssba_coaches_get_all() {
    $posts = get_posts( [
        'post_type'      => 'ssba_coach',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'meta_key'       => 'ssba_coach_order',
        'orderby'        => 'meta_value_num',
        'order'          => 'ASC',
    ] );
    return rest_ensure_response( array_map( 'ssba_coaches_format', $posts ) );
}

function ssba_coaches_get_single( $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_coach' || $post->post_status !== 'publish' ) {
        return new WP_Error( 'not_found', '指導者が見つかりません', [ 'status' => 404 ] );
    }
    return rest_ensure_response( ssba_coaches_format( $post ) );
}
