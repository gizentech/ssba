<?php
/**
 * Plugin Name: SSBA TikTok Videos
 * Description: TikTok OAuth連携と最新動画APIを提供するプラグイン
 * Version: 1.1.0
 */

if (!defined('ABSPATH')) exit;

define('SSBA_TIKTOK_CLIENT_KEY',    'sbawengwbojt102scx');
define('SSBA_TIKTOK_CLIENT_SECRET', 'Oc6BGJaRaU0GUmd7hTVbA8Zj0cTYA9MB');
// TikTok Consoleに登録するredirect URI
define('SSBA_TIKTOK_REDIRECT_URI',  'https://www.google.com');

/* ─────────────────────────────────────────
   REST API エンドポイント登録
───────────────────────────────────────── */
add_action('rest_api_init', function () {

    // 最新3本を返す（フロントが呼ぶ）
    register_rest_route('ssba/v1', '/tiktok-videos', [
        'methods'             => 'GET',
        'callback'            => 'ssba_tiktok_get_videos',
        'permission_callback' => '__return_true',
    ]);

    // コードを受け取ってトークン交換（管理画面のフォームから呼ぶ）
    register_rest_route('ssba/v1', '/tiktok-exchange', [
        'methods'             => 'POST',
        'callback'            => 'ssba_tiktok_exchange_code',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ]);
});

/* ─────────────────────────────────────────
   最新3本を返す
───────────────────────────────────────── */
function ssba_tiktok_get_videos(): WP_REST_Response {
    $access_token = ssba_tiktok_get_valid_token();

    if (!$access_token) {
        return new WP_REST_Response(['error' => '未認証', 'videos' => []], 401);
    }

    $response = wp_remote_post(
        'https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,like_count,view_count,comment_count',
        [
            'headers' => [
                'Authorization' => 'Bearer ' . $access_token,
                'Content-Type'  => 'application/json',
            ],
            'body'    => json_encode(['max_count' => 3]),
            'timeout' => 15,
        ]
    );

    if (is_wp_error($response)) {
        return new WP_REST_Response(['error' => $response->get_error_message(), 'videos' => []], 500);
    }

    $body   = json_decode(wp_remote_retrieve_body($response), true);
    $videos = $body['data']['videos'] ?? [];

    $rest_response = new WP_REST_Response(['videos' => $videos], 200);
    $rest_response->header('Cache-Control', 'no-store');
    $rest_response->header('Access-Control-Allow-Origin', '*');
    return $rest_response;
}

/* ─────────────────────────────────────────
   管理画面からcallback URLを受け取りトークン交換して保存
───────────────────────────────────────── */
function ssba_tiktok_exchange_code(WP_REST_Request $request): WP_REST_Response {
    // callback URLまたはcodeを受け取る
    $callback_url = $request->get_param('callback_url');
    $code         = $request->get_param('code');

    if ($callback_url) {
        // URLからcodeを抽出（PHPでデコード）
        $parsed = parse_url($callback_url);
        parse_str($parsed['query'] ?? '', $params);
        $code = $params['code'] ?? '';
    }

    $code = trim((string) $code);

    if (!$code) {
        return new WP_REST_Response(['error' => 'code が空です'], 400);
    }

    $body = http_build_query([
        'client_key'    => SSBA_TIKTOK_CLIENT_KEY,
        'client_secret' => SSBA_TIKTOK_CLIENT_SECRET,
        'code'          => $code,
        'grant_type'    => 'authorization_code',
        'redirect_uri'  => SSBA_TIKTOK_REDIRECT_URI,
    ]);

    $response = wp_remote_post('https://open.tiktokapis.com/v2/oauth/token/', [
        'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
        'body'    => $body,
        'timeout' => 15,
    ]);

    if (is_wp_error($response)) {
        return new WP_REST_Response(['error' => $response->get_error_message()], 500);
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (empty($data['access_token'])) {
        return new WP_REST_Response(['error' => 'トークン取得失敗', 'detail' => $data], 400);
    }

    update_option('ssba_tiktok_access_token',  $data['access_token']);
    update_option('ssba_tiktok_refresh_token', $data['refresh_token']);
    update_option('ssba_tiktok_expires_at',    time() + (int)$data['expires_in']);

    return new WP_REST_Response(['success' => true], 200);
}

/* ─────────────────────────────────────────
   有効なアクセストークンを返す（自動リフレッシュ）
───────────────────────────────────────── */
function ssba_tiktok_get_valid_token(): ?string {
    $access_token  = get_option('ssba_tiktok_access_token');
    $refresh_token = get_option('ssba_tiktok_refresh_token');
    $expires_at    = (int) get_option('ssba_tiktok_expires_at', 0);

    if (!$access_token) return null;

    if ($expires_at > time() + 300) {
        return $access_token;
    }

    if (!$refresh_token) return null;

    $response = wp_remote_post('https://open.tiktokapis.com/v2/oauth/token/', [
        'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
        'body'    => http_build_query([
            'client_key'    => SSBA_TIKTOK_CLIENT_KEY,
            'client_secret' => SSBA_TIKTOK_CLIENT_SECRET,
            'grant_type'    => 'refresh_token',
            'refresh_token' => $refresh_token,
        ]),
        'timeout' => 15,
    ]);

    if (is_wp_error($response)) return null;

    $data = json_decode(wp_remote_retrieve_body($response), true);
    if (empty($data['access_token'])) return null;

    update_option('ssba_tiktok_access_token',  $data['access_token']);
    update_option('ssba_tiktok_refresh_token', $data['refresh_token'] ?? $refresh_token);
    update_option('ssba_tiktok_expires_at',    time() + (int)$data['expires_in']);

    return $data['access_token'];
}

/* ─────────────────────────────────────────
   管理画面
───────────────────────────────────────── */
add_action('admin_menu', function () {
    add_menu_page(
        'TikTok連携',
        'TikTok連携',
        'manage_options',
        'ssba-tiktok',
        'ssba_tiktok_admin_page',
        'dashicons-video-alt3'
    );
});

function ssba_tiktok_admin_page() {
    $token      = get_option('ssba_tiktok_access_token');
    $expires_at = (int) get_option('ssba_tiktok_expires_at', 0);
    $nonce    = wp_create_nonce('wp_rest');
    $save_url = rest_url('ssba/v1/tiktok-exchange');
    ?>
    <div class="wrap">
        <h1>TikTok連携</h1>

        <?php if ($token): ?>
            <div class="notice notice-success">
                <p>✅ 連携済み　トークン有効期限: <strong><?= date('Y-m-d H:i', $expires_at) ?></strong></p>
            </div>
            <p>
                <a href="<?= esc_url(rest_url('ssba/v1/tiktok-videos')) ?>" target="_blank" class="button">
                    動画APIを確認する
                </a>
            </p>
            <hr>
            <h2>再連携する場合</h2>
        <?php else: ?>
            <div class="notice notice-warning"><p>❌ 未連携。以下の手順でPostmanからトークンを取得して貼り付けてください。</p></div>
        <?php endif; ?>

        <h2 style="margin-top:24px">手順</h2>
        <ol style="font-size:14px; line-height:2.2; max-width:720px;">
            <li>TikTok Developer Console → Redirect URI に <code>https://www.google.com</code> を登録して保存</li>
            <li>下の「① TikTokログインページを開く」をクリック</li>
            <li>TikTokにログインして「許可」を押す</li>
            <li>Googleのページが開く。<strong>URLバーに <code>https://www.google.com?code=XXXX&amp;state=...</code> と表示される</strong></li>
            <li>そのURLをそのままコピーして下のフォームに貼り付け、「② トークンを取得して保存」をクリック</li>
        </ol>

        <?php
        $params = http_build_query([
            'client_key'    => SSBA_TIKTOK_CLIENT_KEY,
            'response_type' => 'code',
            'scope'         => 'user.info.basic,video.list',
            'redirect_uri'  => SSBA_TIKTOK_REDIRECT_URI,
            'state'         => bin2hex(random_bytes(8)),
        ]);
        $oauth_url = 'https://www.tiktok.com/v2/auth/authorize/?' . $params;
        ?>
        <a href="<?= esc_url($oauth_url) ?>" target="_blank" class="button button-primary" style="margin-bottom:24px; display:inline-block;">
            ① TikTokログインページを開く
        </a>

        <div style="max-width:640px; background:#f9f9f9; padding:20px; border:1px solid #ddd;">
            <label style="display:block; margin-bottom:6px; font-weight:bold;">
                コールバックURL（アドレスバーからコピー）:
            </label>
            <input type="text" id="tt_callback_url"
                placeholder="https://www.google.com?code=XXXX&state=..."
                style="width:100%; padding:6px; font-family:monospace; margin-bottom:12px;" />
            <button id="tt_exchange_btn" class="button button-primary">② トークンを取得して保存</button>
            <span id="tt_result" style="margin-left:12px; font-weight:bold;"></span>
        </div>

        <script>
        document.getElementById('tt_exchange_btn').addEventListener('click', function () {
            const rawUrl = document.getElementById('tt_callback_url').value.trim();
            const result = document.getElementById('tt_result');
            result.style.color = '#666';
            result.textContent = '処理中...';

            if (!rawUrl) {
                result.textContent = 'URLを入力してください';
                result.style.color = 'red';
                return;
            }

            // URLをそのままサーバーに渡してPHP側でcodeを抽出
            fetch('<?= esc_js($save_url) ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': '<?= esc_js($nonce) ?>' },
                body: JSON.stringify({ callback_url: rawUrl }),
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    result.textContent = '✅ 連携完了！';
                    result.style.color = 'green';
                    setTimeout(() => location.reload(), 1200);
                } else {
                    result.textContent = '❌ ' + JSON.stringify(data.detail || data.error || data);
                    result.style.color = 'red';
                }
            })
            .catch(e => {
                result.textContent = '❌ ' + e.message;
                result.style.color = 'red';
            });
        });
        </script>
    </div>
    <?php
}
