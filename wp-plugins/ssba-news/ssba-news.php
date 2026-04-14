<?php
/**
 * Plugin Name: SSBA News Manager
 * Description: SSBA お知らせの管理と REST API 提供
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
        header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, X-SSBA-Admin-Key' );
        return $value;
    } );
}, 15 );

/* -------------------------------------------------------
 * カスタム投稿タイプ登録
 * ------------------------------------------------------- */
add_action( 'init', function () {
    register_post_type( 'ssba_news', [
        'labels' => [
            'name'          => 'お知らせ',
            'singular_name' => 'お知らせ',
            'add_new_item'  => 'お知らせを追加',
            'edit_item'     => 'お知らせを編集',
            'all_items'     => 'お知らせ一覧',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => false,
        'supports'      => [ 'title', 'editor', 'thumbnail' ],
        'menu_icon'     => 'dashicons-megaphone',
        'menu_position' => 21,
    ] );

    // カテゴリータクソノミー
    register_taxonomy( 'ssba_news_cat', 'ssba_news', [
        'labels' => [
            'name'          => 'カテゴリー',
            'singular_name' => 'カテゴリー',
            'add_new_item'  => 'カテゴリーを追加',
        ],
        'hierarchical'  => true,
        'show_ui'       => true,
        'show_in_rest'  => false,
    ] );
} );

/* -------------------------------------------------------
 * メタボックス
 * ------------------------------------------------------- */
add_action( 'add_meta_boxes', function () {
    add_meta_box(
        'ssba_news_meta',
        'お知らせ詳細',
        'ssba_news_meta_box_html',
        'ssba_news',
        'side',
        'high'
    );
} );

function ssba_news_meta_box_html( $post ) {
    wp_nonce_field( 'ssba_news_save', 'ssba_news_nonce' );
    $tag       = get_post_meta( $post->ID, 'ssba_news_tag', true );
    $important = get_post_meta( $post->ID, 'ssba_news_important', true );
    echo '<p><label><strong>タグ（例：お知らせ・イベント）</strong></label><br>';
    echo '<input type="text" name="ssba_news_tag" value="' . esc_attr( $tag ) . '" style="width:100%"></p>';
    echo '<p><label style="display:flex;align-items:center;gap:6px;cursor:pointer;">';
    echo '<input type="checkbox" name="ssba_news_important" value="1"' . checked( $important, '1', false ) . '>';
    echo '<strong>重要（トップページに表示）</strong></label></p>';
}

add_action( 'save_post_ssba_news', function ( $post_id ) {
    if ( ! isset( $_POST['ssba_news_nonce'] ) || ! wp_verify_nonce( $_POST['ssba_news_nonce'], 'ssba_news_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;
    if ( isset( $_POST['ssba_news_tag'] ) ) {
        update_post_meta( $post_id, 'ssba_news_tag', sanitize_text_field( wp_unslash( $_POST['ssba_news_tag'] ) ) );
    }
    update_post_meta( $post_id, 'ssba_news_important', isset( $_POST['ssba_news_important'] ) ? '1' : '0' );
} );

// 管理キー認証
if ( ! defined( 'SSBA_ADMIN_KEY' ) ) {
    define( 'SSBA_ADMIN_KEY', 'ssba1223' );
}
function ssba_news_check_key( WP_REST_Request $request ) {
    return $request->get_header( 'X-SSBA-Admin-Key' ) === SSBA_ADMIN_KEY;
}

/* -------------------------------------------------------
 * REST API
 * GET    /wp-json/ssba/v1/news
 * GET    /wp-json/ssba/v1/news/{id}
 * POST   /wp-json/ssba/v1/news
 * PUT    /wp-json/ssba/v1/news/{id}
 * DELETE /wp-json/ssba/v1/news/{id}
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/news', [
        [
            'methods'             => 'GET',
            'callback'            => 'ssba_news_get_all',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => 'POST',
            'callback'            => 'ssba_news_create',
            'permission_callback' => 'ssba_news_check_key',
        ],
    ] );
    register_rest_route( 'ssba/v1', '/news/(?P<id>\d+)', [
        [
            'methods'             => 'GET',
            'callback'            => 'ssba_news_get_single',
            'permission_callback' => '__return_true',
            'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
        ],
        [
            'methods'             => 'PUT',
            'callback'            => 'ssba_news_update',
            'permission_callback' => 'ssba_news_check_key',
            'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
        ],
        [
            'methods'             => 'DELETE',
            'callback'            => 'ssba_news_delete',
            'permission_callback' => 'ssba_news_check_key',
            'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
        ],
    ] );
} );

function ssba_news_format( $post ) {
    $image_url = '';
    if ( has_post_thumbnail( $post->ID ) ) {
        $image_url = get_the_post_thumbnail_url( $post->ID, 'large' );
    }
    $terms = get_the_terms( $post->ID, 'ssba_news_cat' );
    $category = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';

    return [
        'id'        => $post->ID,
        'title'     => $post->post_title,
        'content'   => apply_filters( 'the_content', $post->post_content ),
        'date'      => get_the_date( 'Y.m.d', $post ),
        'tag'       => get_post_meta( $post->ID, 'ssba_news_tag', true ),
        'important' => get_post_meta( $post->ID, 'ssba_news_important', true ) === '1',
        'category'  => $category,
        'image'     => $image_url,
        'slug'      => $post->post_name,
    ];
}

function ssba_news_get_all( $request ) {
    $per_page  = isset( $request['per_page'] ) ? (int) $request['per_page'] : -1;
    $page      = isset( $request['page'] ) ? (int) $request['page'] : 1;
    $important = isset( $request['important'] ) ? (string) $request['important'] : '';

    $args = [
        'post_type'      => 'ssba_news',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
    ];

    if ( $important === '1' ) {
        $args['meta_query'] = [
            [ 'key' => 'ssba_news_important', 'value' => '1', 'compare' => '=' ],
        ];
    }

    $posts = get_posts( $args );
    return rest_ensure_response( array_map( 'ssba_news_format', $posts ) );
}

function ssba_news_get_single( $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_news' ) {
        return new WP_Error( 'not_found', '記事が見つかりません', [ 'status' => 404 ] );
    }
    return rest_ensure_response( ssba_news_format( $post ) );
}

function ssba_news_create( WP_REST_Request $request ) {
    $body      = $request->get_json_params();
    $title     = sanitize_text_field( $body['title'] ?? '' );
    $content   = wp_kses_post( $body['content'] ?? '' );
    $tag       = sanitize_text_field( $body['tag'] ?? '' );
    $important = ! empty( $body['important'] ) ? '1' : '0';

    if ( ! $title ) {
        return new WP_Error( 'missing_title', 'タイトルは必須です', [ 'status' => 400 ] );
    }

    $post_id = wp_insert_post( [
        'post_type'    => 'ssba_news',
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
    ] );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'create_failed', '作成に失敗しました', [ 'status' => 500 ] );
    }

    update_post_meta( $post_id, 'ssba_news_tag', $tag );
    update_post_meta( $post_id, 'ssba_news_important', $important );

    return rest_ensure_response( ssba_news_format( get_post( $post_id ) ) );
}

function ssba_news_update( WP_REST_Request $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_news' ) {
        return new WP_Error( 'not_found', '記事が見つかりません', [ 'status' => 404 ] );
    }

    $body      = $request->get_json_params();
    $title     = sanitize_text_field( $body['title'] ?? $post->post_title );
    $content   = wp_kses_post( $body['content'] ?? $post->post_content );
    $tag       = sanitize_text_field( $body['tag'] ?? '' );
    $important = ! empty( $body['important'] ) ? '1' : '0';

    wp_update_post( [
        'ID'           => $post->ID,
        'post_title'   => $title,
        'post_content' => $content,
    ] );

    update_post_meta( $post->ID, 'ssba_news_tag', $tag );
    update_post_meta( $post->ID, 'ssba_news_important', $important );

    return rest_ensure_response( ssba_news_format( get_post( $post->ID ) ) );
}

function ssba_news_delete( WP_REST_Request $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_news' ) {
        return new WP_Error( 'not_found', '記事が見つかりません', [ 'status' => 404 ] );
    }
    wp_delete_post( $post->ID, true );
    return rest_ensure_response( [ 'deleted' => true ] );
}
