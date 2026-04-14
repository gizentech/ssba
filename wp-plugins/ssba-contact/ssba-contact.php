<?php
/**
 * Plugin Name: SSBA Contact
 * Description: お問い合わせフォームのREST APIエンドポイントとメール送信
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ============================================================
// REST API エンドポイント登録
// ============================================================
add_action( 'rest_api_init', function () {
    register_rest_route( 'ssba/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'ssba_contact_submit',
        'permission_callback' => '__return_true',
        'args'                => [
            'name'    => [ 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ],
            'email'   => [ 'required' => true, 'sanitize_callback' => 'sanitize_email' ],
            'type'    => [ 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ],
            'message' => [ 'required' => true, 'sanitize_callback' => 'sanitize_textarea_field' ],
        ],
    ] );
} );

// ============================================================
// CORS ヘッダー（静的サイトからのリクエストを許可）
// ============================================================
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $value ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type' );
        return $value;
    } );
}, 15 );

// ============================================================
// 送信処理
// ============================================================
function ssba_contact_submit( WP_REST_Request $request ) {
    $name    = $request->get_param( 'name' );
    $email   = $request->get_param( 'email' );
    $type    = $request->get_param( 'type' );
    $message = $request->get_param( 'message' );

    // バリデーション
    if ( ! $name || ! $email || ! $type || ! $message ) {
        return new WP_Error( 'missing_fields', '必須項目を入力してください', [ 'status' => 400 ] );
    }
    if ( ! is_email( $email ) ) {
        return new WP_Error( 'invalid_email', '正しいメールアドレスを入力してください', [ 'status' => 400 ] );
    }

    // 送信先メールアドレス
    $to      = 'ssba1223dn@gmail.com';
    $subject = '[SSBA] お問い合わせ：' . $type;

    $body  = "お問い合わせが届きました。\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $body .= "お名前：{$name}\n";
    $body .= "メールアドレス：{$email}\n";
    $body .= "種別：{$type}\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "【お問い合わせ内容】\n{$message}\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $body .= "※このメールはSSBAウェブサイトのお問い合わせフォームから自動送信されました。\n";

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'From: SSBA Website <noreply@ssba1223.com>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'Bcc: shiraishi@jsbb-fukuoka.com',
    ];

    $sent = wp_mail( $to, $subject, $body, $headers );

    if ( ! $sent ) {
        return new WP_Error( 'mail_failed', 'メール送信に失敗しました。直接メールでお問い合わせください。', [ 'status' => 500 ] );
    }

    // 自動返信メール（お客様宛）
    $auto_subject = '[SSBA] お問い合わせを受け付けました';
    $auto_body    = "{$name} 様\n\n";
    $auto_body   .= "この度はSSBAへのお問い合わせありがとうございます。\n";
    $auto_body   .= "以下の内容でお問い合わせを受け付けました。\n\n";
    $auto_body   .= "━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $auto_body   .= "種別：{$type}\n\n";
    $auto_body   .= "【お問い合わせ内容】\n{$message}\n\n";
    $auto_body   .= "━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $auto_body   .= "内容を確認の上、2営業日以内にご返信いたします。\n\n";
    $auto_body   .= "SSBA - Shootingstar Baseball Academy\n";
    $auto_body   .= "MAIL: ssba1223dn@gmail.com\n";

    $auto_headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'From: SSBA <' . $to . '>',
    ];

    wp_mail( $email, $auto_subject, $auto_body, $auto_headers );

    return rest_ensure_response( [ 'message' => 'ok' ] );
}
