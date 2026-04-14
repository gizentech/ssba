<?php
/**
 * Plugin Name: SSBA Data Seeder
 * Description: 既存 Next.js ページのデータを WordPress に一括投入するシーダー。
 *              有効化 → 管理画面の「SSBAシーダー」ページから実行。
 *              実行後はプラグインを無効化・削除してください。
 * Version: 1.0.0
 * Author: SSBA
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* -------------------------------------------------------
 * 管理画面メニュー
 * ------------------------------------------------------- */
add_action( 'admin_menu', function () {
    add_menu_page(
        'SSBA シーダー',
        '⚡ SSBAシーダー',
        'manage_options',
        'ssba_seeder',
        'ssba_seeder_page_html',
        'dashicons-database-import',
        99
    );
} );

function ssba_seeder_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) return;

    $results = [];

    if ( isset( $_POST['ssba_run_seed'] ) && check_admin_referer( 'ssba_seed_run' ) ) {
        $target = sanitize_text_field( $_POST['seed_target'] ?? 'all' );

        if ( $target === 'all' || $target === 'courses' ) {
            $results[] = ssba_seed_courses();
        }
        if ( $target === 'all' || $target === 'coaches' ) {
            $results[] = ssba_seed_coaches();
        }
        if ( $target === 'all' || $target === 'reason' ) {
            $results[] = ssba_seed_reason();
        }
        if ( $target === 'all' || $target === 'availability' ) {
            $results[] = ssba_seed_availability();
        }
        if ( $target === 'all' || $target === 'partners' ) {
            $results[] = ssba_seed_partners();
        }
        if ( $target === 'coach_wakamatsu' ) {
            $results[] = ssba_seed_coach_wakamatsu();
        }
        if ( $target === 'update_courses' ) {
            $results[] = ssba_update_course_descriptions();
        }
    }
    ?>
    <div class="wrap">
        <h1>⚡ SSBA データシーダー</h1>
        <p style="color:#d63638;font-weight:bold">⚠ このプラグインは1回だけ実行してください。重複実行すると同じデータが複数作成されます。実行後は無効化・削除してください。</p>

        <?php foreach ( $results as $msg ) : ?>
            <div class="notice notice-success" style="padding:12px"><p><?php echo wp_kses_post( $msg ); ?></p></div>
        <?php endforeach; ?>

        <form method="post" style="margin-top:24px">
            <?php wp_nonce_field( 'ssba_seed_run' ); ?>
            <table class="form-table">
                <tr>
                    <th>投入対象</th>
                    <td>
                        <select name="seed_target">
                            <option value="all">すべて（コース・指導者・選ばれる理由・空き状況・関連団体）</option>
                            <option value="courses">コース・料金のみ</option>
                            <option value="coaches">指導者紹介のみ</option>
                            <option value="reason">選ばれる理由のみ</option>
                            <option value="availability">アカデミー空き状況のみ</option>
                            <option value="partners">関連団体のみ</option>
                            <option value="coach_wakamatsu">【追加】指導者：若松悠平を追加</option>
                            <option value="update_courses">【更新】コース説明文・タイトルを更新</option>
                        </select>
                    </td>
                </tr>
            </table>
            <p style="color:#888">※ お知らせ・コラムは手動で入力してください（既存データなし）。</p>
            <?php submit_button( '▶ データを投入する', 'primary large', 'ssba_run_seed', false ); ?>
        </form>
    </div>
    <?php
}

/* -------------------------------------------------------
 * コース・料金（7件）
 * ------------------------------------------------------- */
function ssba_seed_courses() {
    $courses = [
        [
            'title'       => '小学生クラス',
            'number'      => '①',
            'subtitle'    => '',
            'tag'         => '',
            'schedule'    => '月曜日〜金曜日 17:15〜18:35',
            'capacity'    => '定員 8名',
            'price'       => '13,200',
            'price_note'  => '税込 / 月4回',
            'description' => '小学1年生~6年生対象のクラス。野球の基本である投げる、捕る、打つの基本動作から試合中に必要となる応用スキルを学ぶクラス。それぞれの課題をコミュニケーションをとりながらサポートいたします',
            'order'       => 1,
        ],
        [
            'title'       => '中学生クラス',
            'number'      => '②',
            'subtitle'    => '硬式軟式混合',
            'tag'         => '',
            'schedule'    => '月・木・金曜日 18:45〜20:10',
            'capacity'    => '定員 8名',
            'price'       => '15,400',
            'price_note'  => '税込 / 月4回',
            'description' => 'こちらのクラスでは量と質の両方を追いながら練習していきます。トレーニングや技術指導もより細かい指導となります。軟式、硬式を分けて行うのでどちらも対応しています。',
            'order'       => 2,
        ],
        [
            'title'       => '小学6年生限定 ハイレベルクラス',
            'number'      => '③',
            'subtitle'    => '',
            'tag'         => '新設クラス',
            'schedule'    => '水曜日 18:45〜20:10',
            'capacity'    => '定員 10名',
            'price'       => '15,400',
            'price_note'  => '税込 / 月4回',
            'description' => '元プロ野球独立リーグのスタッフによるハイレベルな技術練習＋トレーニングを指導するクラス。毎月一回ラプソードでの球速、打球速度計測、柔軟性、瞬発力など SSBAオリジナルメニューをデータ化し成長をサポートする。定期交流戦やグランド練習など計画予定。',
            'order'       => 3,
        ],
        [
            'title'       => '中学3年生限定高校野球準備クラス',
            'number'      => '④',
            'subtitle'    => '',
            'tag'         => '期間限定',
            'schedule'    => '9月〜3月 土曜日 17:00〜19:00',
            'capacity'    => '',
            'price'       => '16,000',
            'price_note'  => '税込',
            'description' => '毎年9月~3月までの期間限定クラス。高校野球へ向けた硬式球での練習。トレーニングも高校野球を意識した強度となります。こちらのクラスでは他団体との交流戦も行っております。チーム引退後から高校入学までの重要な期間をサポートいたします。',
            'order'       => 4,
        ],
        [
            'title'       => 'パーソナルレッスン',
            'number'      => '⑤',
            'subtitle'    => '',
            'tag'         => '',
            'schedule'    => '60分',
            'capacity'    => '',
            'price'       => '6,600',
            'price_note'  => '※2名まで同額',
            'description' => '対応可能時のみ。選手の要望に合わせメニューを組みサポートいたします。1人~2人まで同額なので兄弟やチームメイトとの練習にもおすすめ。',
            'order'       => 5,
        ],
        [
            'title'       => 'ラプソード計測',
            'number'      => '⑥',
            'subtitle'    => '',
            'tag'         => '',
            'schedule'    => '',
            'capacity'    => '',
            'price'       => '',
            'price_note'  => '',
            'description' => 'ラプソード3.0での測定。投手では球速や回転数を知りたい選手、打者では打球速度や打球角度が正確に計測できます。スクール外の対応可能時のみ受け付けております。出張での測定も可能です。',
            'order'       => 6,
        ],
        [
            'title'       => 'チーム指導',
            'number'      => '⑦',
            'subtitle'    => '',
            'tag'         => '',
            'schedule'    => '',
            'capacity'    => '',
            'price'       => '',
            'price_note'  => '',
            'description' => '打撃、守備、投球、走塁など要望にお応えしながらチーム単位で指導させていただきます。グランド練習での指導もSSBA室内練習場でも対応可能です。',
            'order'       => 7,
        ],
    ];

    $count = 0;
    foreach ( $courses as $c ) {
        $post_id = wp_insert_post( [
            'post_title'  => $c['title'],
            'post_type'   => 'ssba_course',
            'post_status' => 'publish',
        ] );
        if ( is_wp_error( $post_id ) ) continue;

        update_post_meta( $post_id, 'ssba_course_number',     $c['number'] );
        update_post_meta( $post_id, 'ssba_course_subtitle',   $c['subtitle'] );
        update_post_meta( $post_id, 'ssba_course_tag',        $c['tag'] );
        update_post_meta( $post_id, 'ssba_course_schedule',   $c['schedule'] );
        update_post_meta( $post_id, 'ssba_course_capacity',   $c['capacity'] );
        update_post_meta( $post_id, 'ssba_course_price',      $c['price'] );
        update_post_meta( $post_id, 'ssba_course_price_note', $c['price_note'] );
        update_post_meta( $post_id, 'ssba_course_description',$c['description'] );
        update_post_meta( $post_id, 'ssba_course_order',      $c['order'] );
        $count++;
    }

    return "✅ コース {$count}件 を投入しました。<br>※ 各コースのアイキャッチ画像は管理画面から手動で設定してください（course1.webp〜course7.webp）。";
}

/* -------------------------------------------------------
 * 指導者紹介（流 大輔）
 * ------------------------------------------------------- */
function ssba_seed_coaches() {
    $profile_text = implode( "\n", [
        '福岡県久留米市出身 1989/3/11生まれ',
        '祐誠高校',
        '社会人クラブチーム福岡オーシャンズ9',
        'プロ野球独立リーグ 四国アイランドリーグ plus',
        '  高知ファイティングドッグス　2008〜2011',
        '  愛媛マンダリンパイレーツ　2012〜同年引退',
        '（株）サニクリーン九州福岡軟式野球部　2013〜2015',
        '高知ファイティングドッグススカウト　2015〜',
    ] );

    $career = [
        [
            'subtitle' => '祐誠高校 時代',
            'items'    => [
                '2004年秋季高校野球福岡県大会3位',
                '2004年秋季高校野球九州大会出場',
            ],
        ],
        [
            'subtitle' => 'プロ野球独立リーグ四国アイランドリーグ時代',
            'teams'    => [
                [
                    'name'  => '高知ファイティングドッグス 2008年〜2011年',
                    'items' => [
                        '2009年独立リーグ日本一',
                        '2011年最多盗塁王 通算128盗塁',
                    ],
                ],
                [
                    'name'  => '愛媛マンダリンパイレーツ 2012年',
                    'items' => [
                        '2012年後期優勝 打率部門リーグ7位',
                    ],
                ],
            ],
        ],
        [
            'subtitle' => '社会人軟式野球時代',
            'items'    => [
                '軟式野球福岡県代表国体選手 2013年',
            ],
        ],
    ];

    // ギャラリー: WPメディアライブラリにアップ後、管理画面から設定
    $gallery_urls = '';

    $post_id = wp_insert_post( [
        'post_title'  => '流 大輔',
        'post_type'   => 'ssba_coach',
        'post_status' => 'publish',
    ] );

    if ( is_wp_error( $post_id ) ) {
        return '❌ 指導者の投入に失敗しました: ' . $post_id->get_error_message();
    }

    update_post_meta( $post_id, 'ssba_coach_role',        '代表 / ヘッドコーチ' );
    update_post_meta( $post_id, 'ssba_coach_name',        '流 大輔' );
    update_post_meta( $post_id, 'ssba_coach_name_en',     'Daisuke Nagare' );
    update_post_meta( $post_id, 'ssba_coach_order',       1 );
    update_post_meta( $post_id, 'ssba_coach_profile',     $profile_text );
    update_post_meta( $post_id, 'ssba_coach_career_json', wp_slash( json_encode( $career, JSON_UNESCAPED_UNICODE ) ) );
    update_post_meta( $post_id, 'ssba_coach_gallery',     $gallery_urls );

    return "✅ 指導者「流 大輔」を投入しました（投稿ID: {$post_id}）。<br>
            ⚠ アイキャッチ画像（nagare.webp）とギャラリー画像（nagare01〜06.avif）は管理画面から設定してください。<br>
            ⚠ ご挨拶文は管理画面「指導者紹介」→「流 大輔」の編集から追加してください。";
}

/* -------------------------------------------------------
 * 選ばれる理由
 * ------------------------------------------------------- */
function ssba_seed_reason() {
    $lead = '当野球塾は、小学生から大人まで、幅広い世代の選手一人ひとりの成長をサポートするための野球塾です。夢や目標に向かって努力する環境を提供し、「できる」を積み重ねることで確実なレベルアップを目指します。';

    $bullets = [
        '個人練習の環境が少なく、スキルアップに悩んでいる',
        '正しい技術やプロの考え方を学びたい',
        '目標を明確にし、成長の道筋を立てたい',
        '自分のフォームを客観的に分析したい',
        '一歩ずつ確実にレベルアップしたい',
    ];

    $sections = [
        [
            'title'      => '基本を徹底することが、上達への最短ルート',
            'paragraphs' => [
                '私はこれまで、多くのプロ野球選手と共にプレーし、練習を重ねてきました。その中で強く感じたのは、一流の選手ほど基本を大切にしているということです。',
                'どの選手も例外なく、基本動作の反復練習を徹底しています。この積み重ねがあるからこそ、高いパフォーマンスを維持し続けることができるのです。',
                '特に、小学生・中学生の時期は、正しい基本動作を身につけることが非常に重要です。誤ったフォームのまま続けてしまうと、それが癖となり、成長の妨げやケガの原因にもなります。',
            ],
        ],
        [
            'title'      => '一人ひとりに寄り添った指導',
            'paragraphs' => [
                '当塾では、生徒一人ひとりとのコミュニケーションを大切にし、それぞれの課題や目標に合わせて段階的に指導を行います。',
                '「できなかったことができるようになる」その積み重ねが、自信とさらなる向上心へとつながります。',
            ],
        ],
    ];

    // 追加テキスト（元コードにあった動画解析の説明）
    $sections[0]['paragraphs'][] = '当塾では、動画解析を活用しフォームを記録。良い状態と悪い状態を比較することで、効率的な改善を実現します。';

    update_option( 'ssba_reason_lead',     $lead );
    update_option( 'ssba_reason_hero_url', '' ); // 画像はWPメディアライブラリから設定
    update_option( 'ssba_reason_bullets',  implode( "\n", $bullets ) );
    update_option( 'ssba_reason_sections', json_encode( $sections, JSON_UNESCAPED_UNICODE ) );

    return '✅ 「選ばれる理由」ページのデータを投入しました。<br>⚠ ヘッダー画像（makihara_nagare.webp）はWP管理画面「選ばれる理由」から設定してください。';
}

/* -------------------------------------------------------
 * アカデミー空き状況（availability.json の内容）
 * ------------------------------------------------------- */
function ssba_seed_availability() {
    $data = [
        'classes' => [
            [ 'id' => 'elementary',    'name' => '小学生クラス',    'subtitle' => '17:15〜18:35',                   'schedule' => '', 'days' => [ 'mon' => '○', 'tue' => '○', 'wed' => '○', 'thu' => '○', 'fri' => '○', 'sat' => '×' ] ],
            [ 'id' => 'junior-high',   'name' => '中学生クラス',    'subtitle' => '18:45〜20:10',                   'schedule' => '', 'days' => [ 'mon' => '○', 'tue' => '×', 'wed' => '×', 'thu' => '○', 'fri' => '○', 'sat' => '×' ] ],
            [ 'id' => 'high-level',    'name' => 'ハイレベルクラス','subtitle' => '小学6年生限定 / 18:45〜20:10',    'schedule' => '', 'days' => [ 'mon' => '△', 'tue' => '△', 'wed' => '○', 'thu' => '×', 'fri' => '×', 'sat' => '×' ] ],
            [ 'id' => 'junior-high-3', 'name' => '中学3年生クラス','subtitle' => '9月〜3月のみ / 17:00〜19:00',     'schedule' => '', 'days' => [ 'mon' => '×', 'tue' => '×', 'wed' => '×', 'thu' => '×', 'fri' => '×', 'sat' => '○' ] ],
            [ 'id' => 'new-class',     'name' => '新設クラス',      'subtitle' => '準備中',                         'schedule' => '', 'days' => [ 'mon' => '−', 'tue' => '−', 'wed' => '−', 'thu' => '−', 'fri' => '−', 'sat' => '−' ] ],
        ],
    ];

    update_option( 'ssba_availability_data', json_encode( $data, JSON_UNESCAPED_UNICODE ) );
    return '✅ アカデミー空き状況（5クラス）を投入しました。管理画面「空き状況」から変更できます。';
}

/* -------------------------------------------------------
 * 関連団体（partners.json の内容）
 * ------------------------------------------------------- */
function ssba_seed_partners() {
    $data = [
        'partners' => [
            [ 'id' => 1, 'src' => '', 'alt' => 'バナー1', 'href' => '#' ],
            [ 'id' => 2, 'src' => '', 'alt' => 'バナー2', 'href' => '#' ],
            [ 'id' => 3, 'src' => '', 'alt' => 'バナー3', 'href' => '#' ],
            [ 'id' => 4, 'src' => '', 'alt' => 'バナー4', 'href' => '#' ],
        ],
    ];

    update_option( 'ssba_partners_data', json_encode( $data, JSON_UNESCAPED_UNICODE ) );
    return '✅ 関連団体（4件）の枠を投入しました。<br>⚠ バナー画像URLとリンク先は管理画面「関連団体」から設定してください。';
}

/* -------------------------------------------------------
 * 指導者紹介（若松悠平）追加
 * ※ 流 大輔は既にシード済みのため、このオプションで個別追加
 * ------------------------------------------------------- */
function ssba_seed_coach_wakamatsu() {
    $profile_text = implode( "\n", [
        '祐誠高校',
        '長崎国際大学',
        '香川オリーブガイナーズ',
        '福島レッドホープス',
    ] );

    $career = [
        [
            'subtitle' => '球歴',
            'items'    => [
                '祐誠高校',
                '長崎国際大学',
                '香川オリーブガイナーズ',
                '福島レッドホープス',
            ],
        ],
    ];

    $post_id = wp_insert_post( [
        'post_title'  => '若松悠平',
        'post_type'   => 'ssba_coach',
        'post_status' => 'publish',
    ] );

    if ( is_wp_error( $post_id ) ) {
        return '❌ 指導者の投入に失敗しました: ' . $post_id->get_error_message();
    }

    update_post_meta( $post_id, 'ssba_coach_role',        'スタッフ' );
    update_post_meta( $post_id, 'ssba_coach_name',        '若松悠平' );
    update_post_meta( $post_id, 'ssba_coach_name_en',     'Yuhei Wakamatsu' );
    update_post_meta( $post_id, 'ssba_coach_order',       2 );
    update_post_meta( $post_id, 'ssba_coach_profile',     $profile_text );
    update_post_meta( $post_id, 'ssba_coach_career_json', wp_slash( json_encode( $career, JSON_UNESCAPED_UNICODE ) ) );
    update_post_meta( $post_id, 'ssba_coach_gallery',     '' );

    return "✅ 指導者「若松悠平」を投入しました（投稿ID: {$post_id}）。<br>⚠ アイキャッチ画像は管理画面「指導者紹介」→「若松悠平」の編集から設定してください。";
}

/* -------------------------------------------------------
 * コース説明文・タイトル更新（既存データを上書き）
 * ※ コースが既にシード済みの場合にこのオプションで更新
 * ------------------------------------------------------- */
function ssba_update_course_descriptions() {
    $updates = [
        '小学生クラス' => [
            'description' => '小学1年生~6年生対象のクラス。野球の基本である投げる、捕る、打つの基本動作から試合中に必要となる応用スキルを学ぶクラス。それぞれの課題をコミュニケーションをとりながらサポートいたします',
        ],
        '中学生クラス' => [
            'description' => 'こちらのクラスでは量と質の両方を追いながら練習していきます。トレーニングや技術指導もより細かい指導となります。軟式、硬式を分けて行うのでどちらも対応しています。',
        ],
        '中学3年生クラス' => [
            'new_title'   => '中学3年生限定高校野球準備クラス',
            'tag'         => '期間限定',
            'description' => '毎年9月~3月までの期間限定クラス。高校野球へ向けた硬式球での練習。トレーニングも高校野球を意識した強度となります。こちらのクラスでは他団体との交流戦も行っております。チーム引退後から高校入学までの重要な期間をサポートいたします。',
        ],
        'パーソナルレッスン' => [
            'description' => '対応可能時のみ。選手の要望に合わせメニューを組みサポートいたします。1人~2人まで同額なので兄弟やチームメイトとの練習にもおすすめ。',
        ],
        'ラプソード計測' => [
            'description' => 'ラプソード3.0での測定。投手では球速や回転数を知りたい選手、打者では打球速度や打球角度が正確に計測できます。スクール外の対応可能時のみ受け付けております。出張での測定も可能です。',
        ],
        'チーム出張指導' => [
            'new_title'   => 'チーム指導',
            'description' => '打撃、守備、投球、走塁など要望にお応えしながらチーム単位で指導させていただきます。グランド練習での指導もSSBA室内練習場でも対応可能です。',
        ],
    ];

    $count   = 0;
    $skipped = [];

    foreach ( $updates as $title => $data ) {
        $posts = get_posts( [
            'post_type'   => 'ssba_course',
            'post_status' => 'publish',
            'numberposts' => -1,
        ] );

        $found = null;
        foreach ( $posts as $p ) {
            if ( $p->post_title === $title ) {
                $found = $p;
                break;
            }
        }

        if ( ! $found ) {
            $skipped[] = $title;
            continue;
        }

        $post_id = $found->ID;

        if ( isset( $data['new_title'] ) ) {
            wp_update_post( [ 'ID' => $post_id, 'post_title' => $data['new_title'] ] );
        }
        if ( isset( $data['description'] ) ) {
            update_post_meta( $post_id, 'ssba_course_description', $data['description'] );
        }
        if ( isset( $data['tag'] ) ) {
            update_post_meta( $post_id, 'ssba_course_tag', $data['tag'] );
        }
        $count++;
    }

    $msg = "✅ コース {$count}件 の説明文を更新しました。";
    if ( ! empty( $skipped ) ) {
        $msg .= '<br>⚠ 以下のコースは見つかりませんでした（タイトルを確認してください）：' . implode( '、', $skipped );
    }
    return $msg;
}
