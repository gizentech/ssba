<?php
/**
 * Plugin Name: SSBA Course Manager
 * Description: SSBA コース・料金の管理と REST API 提供
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
    register_post_type( 'ssba_course', [
        'labels' => [
            'name'          => 'コース・料金',
            'singular_name' => 'コース',
            'add_new_item'  => 'コースを追加',
            'edit_item'     => 'コースを編集',
            'new_item'      => '新しいコース',
            'all_items'     => '全コース一覧',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'supports'     => [ 'title', 'thumbnail' ],
        'menu_icon'    => 'dashicons-awards',
        'menu_position'=> 20,
    ] );
} );

/* -------------------------------------------------------
 * メタボックス
 * ------------------------------------------------------- */
add_action( 'add_meta_boxes', function () {
    add_meta_box(
        'ssba_course_details',
        'コース詳細',
        'ssba_course_meta_box_html',
        'ssba_course',
        'normal',
        'high'
    );
} );

function ssba_course_meta_box_html( $post ) {
    wp_nonce_field( 'ssba_course_save', 'ssba_course_nonce' );
    $fields = [
        'ssba_course_number'      => [ 'label' => '番号（①②など）',          'type' => 'text' ],
        'ssba_course_subtitle'    => [ 'label' => 'サブタイトル',              'type' => 'text' ],
        'ssba_course_tag'         => [ 'label' => 'タグ（例：新設クラス）',     'type' => 'text' ],
        'ssba_course_schedule'    => [ 'label' => '日時・スケジュール',         'type' => 'text' ],
        'ssba_course_capacity'    => [ 'label' => '定員',                      'type' => 'text' ],
        'ssba_course_price'       => [ 'label' => '料金（数字のみ 例：13200）', 'type' => 'text' ],
        'ssba_course_price_note'  => [ 'label' => '料金備考（例：税込 / 月4回）','type' => 'text' ],
        'ssba_course_description' => [ 'label' => '説明文',                    'type' => 'textarea' ],
        'ssba_course_order'       => [ 'label' => '表示順（数字が小さい順）',   'type' => 'number' ],
    ];
    echo '<table style="width:100%;border-collapse:collapse">';
    foreach ( $fields as $key => $field ) {
        $value = get_post_meta( $post->ID, $key, true );
        echo '<tr><td style="padding:8px 4px;width:220px;vertical-align:top"><strong>' . esc_html( $field['label'] ) . '</strong></td><td style="padding:8px 4px">';
        if ( $field['type'] === 'textarea' ) {
            echo '<textarea name="' . esc_attr( $key ) . '" style="width:100%;height:80px">' . esc_textarea( $value ) . '</textarea>';
        } else {
            echo '<input type="' . esc_attr( $field['type'] ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '" style="width:100%">';
        }
        echo '</td></tr>';
    }
    echo '</table>';
    echo '<p style="color:#888;margin-top:8px">※ アイキャッチ画像がコース画像になります。</p>';
}

add_action( 'save_post_ssba_course', function ( $post_id ) {
    if ( ! isset( $_POST['ssba_course_nonce'] ) || ! wp_verify_nonce( $_POST['ssba_course_nonce'], 'ssba_course_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $keys = [
        'ssba_course_number', 'ssba_course_subtitle', 'ssba_course_tag',
        'ssba_course_schedule', 'ssba_course_capacity', 'ssba_course_price',
        'ssba_course_price_note', 'ssba_course_description', 'ssba_course_order',
    ];
    foreach ( $keys as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) );
        }
    }
} );

/* -------------------------------------------------------
 * REST API
 * GET /wp-json/ssba/v1/courses
 * ------------------------------------------------------- */
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/courses', [
        'methods'             => 'GET',
        'callback'            => 'ssba_course_get_all',
        'permission_callback' => '__return_true',
    ] );
} );

function ssba_course_get_all() {
    $posts = get_posts( [
        'post_type'      => 'ssba_course',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'meta_key'       => 'ssba_course_order',
        'orderby'        => 'meta_value_num',
        'order'          => 'ASC',
    ] );

    $courses = [];
    foreach ( $posts as $post ) {
        $image_url = '';
        if ( has_post_thumbnail( $post->ID ) ) {
            $image_url = get_the_post_thumbnail_url( $post->ID, 'full' );
        }
        $courses[] = [
            'id'          => $post->ID,
            'title'       => $post->post_title,
            'number'      => get_post_meta( $post->ID, 'ssba_course_number', true ),
            'subtitle'    => get_post_meta( $post->ID, 'ssba_course_subtitle', true ),
            'tag'         => get_post_meta( $post->ID, 'ssba_course_tag', true ),
            'schedule'    => get_post_meta( $post->ID, 'ssba_course_schedule', true ),
            'capacity'    => get_post_meta( $post->ID, 'ssba_course_capacity', true ),
            'price'       => get_post_meta( $post->ID, 'ssba_course_price', true ),
            'priceNote'   => get_post_meta( $post->ID, 'ssba_course_price_note', true ),
            'description' => get_post_meta( $post->ID, 'ssba_course_description', true ),
            'image'       => $image_url,
            'order'       => (int) get_post_meta( $post->ID, 'ssba_course_order', true ),
        ];
    }

    return rest_ensure_response( $courses );
}
