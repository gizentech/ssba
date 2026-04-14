<?php
/**
 * Plugin Name: SSBA Column Manager
 * Description: SSBA コラムの管理と REST API 提供
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
    register_post_type( 'ssba_column', [
        'labels' => [
            'name'          => 'コラム',
            'singular_name' => 'コラム',
            'add_new_item'  => 'コラムを追加',
            'edit_item'     => 'コラムを編集',
            'all_items'     => 'コラム一覧',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => false,
        'supports'      => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'menu_icon'     => 'dashicons-edit-page',
        'menu_position' => 22,
    ] );

    register_taxonomy( 'ssba_column_cat', 'ssba_column', [
        'labels' => [
            'name'          => 'カテゴリー',
            'singular_name' => 'カテゴリー',
            'add_new_item'  => 'カテゴリーを追加',
        ],
        'hierarchical' => true,
        'show_ui'      => true,
        'show_in_rest' => false,
    ] );
} );

/* -------------------------------------------------------
 * メタボックス
 * ------------------------------------------------------- */
add_action( 'add_meta_boxes', function () {
    add_meta_box(
        'ssba_column_meta',
        'コラム詳細',
        'ssba_column_meta_box_html',
        'ssba_column',
        'side',
        'high'
    );
} );

function ssba_column_meta_box_html( $post ) {
    wp_nonce_field( 'ssba_column_save', 'ssba_column_nonce' );
    $tag = get_post_meta( $post->ID, 'ssba_column_tag', true );
    echo '<p><label><strong>タグ（例：技術・トレーニング）</strong></label><br>';
    echo '<input type="text" name="ssba_column_tag" value="' . esc_attr( $tag ) . '" style="width:100%"></p>';
    echo '<p style="color:#888;font-size:12px">※ アイキャッチ画像がカード一覧のサムネイルになります。<br>抜粋はカード一覧の説明文に使用されます。</p>';
}

add_action( 'save_post_ssba_column', function ( $post_id ) {
    if ( ! isset( $_POST['ssba_column_nonce'] ) || ! wp_verify_nonce( $_POST['ssba_column_nonce'], 'ssba_column_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;
    if ( isset( $_POST['ssba_column_tag'] ) ) {
        update_post_meta( $post_id, 'ssba_column_tag', sanitize_text_field( wp_unslash( $_POST['ssba_column_tag'] ) ) );
    }
} );

// 管理キー認証
if ( ! defined( 'SSBA_ADMIN_KEY' ) ) {
    define( 'SSBA_ADMIN_KEY', 'ssba1223' );
}
function ssba_column_check_key( WP_REST_Request $request ) {
    return $request->get_header( 'X-SSBA-Admin-Key' ) === SSBA_ADMIN_KEY;
}

/* -------------------------------------------------------
 * REST API
 * GET    /wp-json/ssba/v1/columns
 * GET    /wp-json/ssba/v1/columns/{id}
 * POST   /wp-json/ssba/v1/columns
 * PUT    /wp-json/ssba/v1/columns/{id}
 * DELETE /wp-json/ssba/v1/columns/{id}
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/columns', [
        [
            'methods'             => 'GET',
            'callback'            => 'ssba_column_get_all',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => 'POST',
            'callback'            => 'ssba_column_create',
            'permission_callback' => 'ssba_column_check_key',
        ],
    ] );
    register_rest_route( 'ssba/v1', '/columns/(?P<id>\d+)', [
        [
            'methods'             => 'GET',
            'callback'            => 'ssba_column_get_single',
            'permission_callback' => '__return_true',
            'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
        ],
        [
            'methods'             => 'PUT',
            'callback'            => 'ssba_column_update',
            'permission_callback' => 'ssba_column_check_key',
            'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
        ],
        [
            'methods'             => 'DELETE',
            'callback'            => 'ssba_column_delete',
            'permission_callback' => 'ssba_column_check_key',
            'args'                => [ 'id' => [ 'validate_callback' => 'is_numeric' ] ],
        ],
    ] );
} );

function ssba_column_format( $post ) {
    $image_url = '';
    if ( has_post_thumbnail( $post->ID ) ) {
        $image_url = get_the_post_thumbnail_url( $post->ID, 'large' );
    }
    $terms    = get_the_terms( $post->ID, 'ssba_column_cat' );
    $category = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';
    $excerpt  = $post->post_excerpt ?: wp_trim_words( strip_tags( $post->post_content ), 40, '…' );

    return [
        'id'       => $post->ID,
        'title'    => $post->post_title,
        'content'  => apply_filters( 'the_content', $post->post_content ),
        'excerpt'  => $excerpt,
        'date'     => get_the_date( 'Y.m.d', $post ),
        'tag'      => get_post_meta( $post->ID, 'ssba_column_tag', true ),
        'category' => $category,
        'image'    => $image_url,
        'slug'     => $post->post_name,
    ];
}

function ssba_column_get_all( $request ) {
    $per_page = isset( $request['per_page'] ) ? (int) $request['per_page'] : -1;
    $page     = isset( $request['page'] ) ? (int) $request['page'] : 1;

    $posts = get_posts( [
        'post_type'      => 'ssba_column',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
    ] );

    return rest_ensure_response( array_map( 'ssba_column_format', $posts ) );
}

function ssba_column_get_single( $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_column' ) {
        return new WP_Error( 'not_found', '記事が見つかりません', [ 'status' => 404 ] );
    }
    return rest_ensure_response( ssba_column_format( $post ) );
}

function ssba_column_create( WP_REST_Request $request ) {
    $body    = $request->get_json_params();
    $title   = sanitize_text_field( $body['title'] ?? '' );
    $content = wp_kses_post( $body['content'] ?? '' );
    $excerpt = sanitize_textarea_field( $body['excerpt'] ?? '' );
    $tag     = sanitize_text_field( $body['tag'] ?? '' );

    if ( ! $title ) {
        return new WP_Error( 'missing_title', 'タイトルは必須です', [ 'status' => 400 ] );
    }

    $post_id = wp_insert_post( [
        'post_type'    => 'ssba_column',
        'post_title'   => $title,
        'post_content' => $content,
        'post_excerpt' => $excerpt,
        'post_status'  => 'publish',
    ] );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'create_failed', '作成に失敗しました', [ 'status' => 500 ] );
    }

    update_post_meta( $post_id, 'ssba_column_tag', $tag );
    return rest_ensure_response( ssba_column_format( get_post( $post_id ) ) );
}

function ssba_column_update( WP_REST_Request $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_column' ) {
        return new WP_Error( 'not_found', '記事が見つかりません', [ 'status' => 404 ] );
    }

    $body    = $request->get_json_params();
    $title   = sanitize_text_field( $body['title'] ?? $post->post_title );
    $content = wp_kses_post( $body['content'] ?? $post->post_content );
    $excerpt = sanitize_textarea_field( $body['excerpt'] ?? $post->post_excerpt );
    $tag     = sanitize_text_field( $body['tag'] ?? '' );

    wp_update_post( [
        'ID'           => $post->ID,
        'post_title'   => $title,
        'post_content' => $content,
        'post_excerpt' => $excerpt,
    ] );

    update_post_meta( $post->ID, 'ssba_column_tag', $tag );
    return rest_ensure_response( ssba_column_format( get_post( $post->ID ) ) );
}

function ssba_column_delete( WP_REST_Request $request ) {
    $post = get_post( (int) $request['id'] );
    if ( ! $post || $post->post_type !== 'ssba_column' ) {
        return new WP_Error( 'not_found', '記事が見つかりません', [ 'status' => 404 ] );
    }
    wp_delete_post( $post->ID, true );
    return rest_ensure_response( [ 'deleted' => true ] );
}
