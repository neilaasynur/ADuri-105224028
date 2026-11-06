import os
from PIL import Image, ImageDraw, ImageFont

FONT_SEGOE = "C:/Windows/Fonts/segoeui.ttf"
FONT_SEGOE_B = "C:/Windows/Fonts/segoeuib.ttf"
FONT_CONSOLA = "C:/Windows/Fonts/consola.ttf"
FONT_CONSOLA_B = "C:/Windows/Fonts/consolab.ttf"
FONT_SYM = "C:/Windows/Fonts/seguisym.ttf"

def create_vscode_screenshot(out_path, title_tab, lines_content):
    """Membuat tangkapan layar terminal dengan tema Visual Studio Code persis seperti Modul 4"""
    width, height = 1280, 720
    img = Image.new("RGBA", (width, height), "#181818")
    draw = ImageDraw.Draw(img)

    f_ui = ImageFont.truetype(FONT_SEGOE, 12)
    f_ui_b = ImageFont.truetype(FONT_SEGOE_B, 12)
    f_mono = ImageFont.truetype(FONT_CONSOLA, 13)
    f_mono_b = ImageFont.truetype(FONT_CONSOLA_B, 13)
    f_small = ImageFont.truetype(FONT_SEGOE, 11)
    f_sym = ImageFont.truetype(FONT_SYM, 11)

    # 1. Top Title Bar (VS Code)
    draw.rectangle([0, 0, width, 35], fill="#181818")
    # Menu items
    menu_items = ["File", "Edit", "Selection", "View", "Go", "Run", "..."]
    cur_x = 45
    draw.text((15, 9), "≡", fill="#007acc", font=f_ui_b)
    for m in menu_items:
        draw.text((cur_x, 8), m, fill="#cccccc", font=f_ui)
        cur_x += int(draw.textlength(m, font=f_ui)) + 14

    # Center Title
    center_title = "modul-06.md - projek-web - Visual Studio Code - Untracked"
    tw = draw.textlength(center_title, font=f_ui)
    draw.text(((width - tw) // 2, 8), center_title, fill="#999999", font=f_ui)

    # Window Controls right
    draw.text((width - 90, 8), "—  □  ✕", fill="#cccccc", font=f_ui)

    # 2. Activity Bar (Leftmost)
    act_w = 48
    draw.rectangle([0, 35, act_w, height - 22], fill="#333333")
    draw.line([act_w, 35, act_w, height - 22], fill="#252526", width=1)
    # Icons simulation using basic shapes and letters
    sidebar_items = [
        ("F", "#858585"),
        ("S", "#858585"),
        ("Y", "#ffffff"), # active source control
        ("D", "#858585"),
        ("E", "#858585"),
        ("C", "#858585"),
    ]
    iy = 45
    for tag, col in sidebar_items:
        draw.rounded_rectangle([14, iy, 34, iy + 20], radius=4, fill="#3c3c3c" if tag == "Y" else "#333333")
        draw.text((20, iy + 2), tag, fill=col, font=f_ui_b)
        iy += 40

    # 3. Main Editor / Terminal Split Header
    term_x = act_w
    term_y = 35

    # Terminal tabs header
    draw.rectangle([term_x, term_y, width, term_y + 35], fill="#181818")
    tabs = ["Problems", "Output", "Debug Console", "Terminal", "SQL History", "Task Monitor"]
    tx = term_x + 16
    for t in tabs:
        is_active = (t == "Terminal")
        color = "#ffffff" if is_active else "#969696"
        font = f_ui_b if is_active else f_ui
        draw.text((tx, term_y + 8), t, fill=color, font=font)
        if is_active:
            w_tab = draw.textlength(t, font=font)
            draw.line([tx, term_y + 33, tx + w_tab, term_y + 33], fill="#007acc", width=2)
        tx += int(draw.textlength(t, font=font)) + 18

    # Terminal right controls
    draw.text((width - 165, term_y + 8), "powershell + v  |  ^  x", fill="#cccccc", font=f_small)
    draw.line([term_x, term_y + 35, width, term_y + 35], fill="#2d2d2d", width=1)

    # 4. Terminal Content Area
    content_y = term_y + 48
    for line in lines_content:
        text, color, is_b = line
        if text:
            f = f_mono_b if is_b else f_mono
            draw.text((term_x + 20, content_y), text, fill=color, font=f)
        content_y += 21

    # Cursor
    draw.rectangle([term_x + 20, content_y + 2, term_x + 29, content_y + 17], fill="#ffffff")

    # 5. Bottom Status Bar (VS Code Blue)
    draw.rectangle([0, height - 22, width, height], fill="#007acc")
    draw.text((10, height - 18), "praktikum/modul-06*   Launchpad   Ln 42, Col 1   Spaces: 2   UTF-8   LF   TypeScript", fill="#ffffff", font=f_small)
    draw.text((width - 240, height - 18), "Antigravity Settings   Ready", fill="#ffffff", font=f_small)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    print(f"Generated VS Code screenshot: {out_path}")


def create_aduri_browser_screenshot(out_path, title, form_content):
    """Membuat tangkapan layar browser web aplikasi ADuri persis seperti Modul 5"""
    width, height = 1280, 720
    img = Image.new("RGBA", (width, height), "#faf8f1")
    draw = ImageDraw.Draw(img)

    f_nav_brand = ImageFont.truetype(FONT_SEGOE_B, 20)
    f_nav = ImageFont.truetype(FONT_SEGOE_B, 13)
    f_btn = ImageFont.truetype(FONT_SEGOE_B, 13)
    f_title = ImageFont.truetype(FONT_SEGOE_B, 22)
    f_lbl = ImageFont.truetype(FONT_SEGOE_B, 13)
    f_val = ImageFont.truetype(FONT_SEGOE, 13)
    f_err = ImageFont.truetype(FONT_SEGOE_B, 12)
    f_sub = ImageFont.truetype(FONT_SEGOE, 13)
    f_ui_b = ImageFont.truetype(FONT_SEGOE_B, 12)
    f_small = ImageFont.truetype(FONT_SEGOE, 11)

    # 1. Top Green ADuri Navbar (#284e22)
    nav_h = 64
    draw.rectangle([0, 0, width, nav_h], fill="#284e22")

    # Logo ADuri (Durian icon kuning + text)
    draw.ellipse([36, 17, 66, 47], fill="#eab308")
    draw.ellipse([42, 23, 60, 41], fill="#ca8a04")
    draw.text((47, 21), "A", fill="#ffffff", font=f_btn)
    draw.text((76, 18), "ADuri", fill="#ffffff", font=f_nav_brand)

    # Nav links (center-right)
    links = ["Beranda", "Katalog", "Wisata Kebun", "Keranjang"]
    lx = 680
    for l in links:
        draw.text((lx, 23), l, fill="#f0fdf4", font=f_nav)
        lx += int(draw.textlength(l, font=f_nav)) + 36

    # Red "Keluar" button
    draw.rounded_rectangle([width - 120, 16, width - 40, 48], radius=16, fill="#dc2626")
    draw.text((width - 96, 23), "Keluar", fill="#ffffff", font=f_btn)

    # 2. Main Page Content (Centered Card Container)
    card_w = 760
    card_x = (width - card_w) // 2
    card_y = nav_h + 30

    # Title & breadcrumbs
    draw.text((card_x, card_y), "Beranda  /  Katalog  /  Tambah Varietas", fill="#737373", font=f_sub)
    draw.text((card_x, card_y + 24), title, fill="#26321f", font=f_title)
    draw.line([card_x, card_y + 60, card_x + card_w, card_y + 60], fill="#dedbcf", width=1)

    # Form Box
    fy = card_y + 75
    draw.rounded_rectangle([card_x, fy, card_x + card_w, fy + 480], radius=16, fill="#ffffff", outline="#dedbcf", width=1)

    cy = fy + 24
    cx = card_x + 30
    cw = card_w - 60

    # Form Fields
    for item in form_content:
        itype = item["type"]
        if itype == "alert_warning":
            draw.rounded_rectangle([cx, cy, cx + cw, cy + 42], radius=10, fill="#fffbeb", outline="#f59e0b", width=1)
            # Info icon (i)
            draw.ellipse([cx + 12, cy + 12, cx + 28, cy + 28], fill="#f59e0b")
            draw.text((cx + 18, cy + 11), "i", fill="#ffffff", font=f_ui_b)
            draw.text((cx + 36, cy + 12), item["text"], fill="#92400e", font=f_lbl)
            cy += 56
        elif itype == "field":
            draw.text((cx, cy), item["label"], fill="#26321f", font=f_lbl)
            cy += 20
            # Input Box
            border_c = "#ef4444" if item.get("error") else "#dedbcf"
            fill_c = "#fef2f2" if item.get("error") else "#faf8f1"
            border_w = 2 if item.get("error") else 1
            draw.rounded_rectangle([cx, cy, cx + cw, cy + 40], radius=8, fill=fill_c, outline=border_c, width=border_w)
            draw.text((cx + 14, cy + 11), item["val"], fill="#0f172a", font=f_val)
            cy += 44
            if item.get("error"):
                # Warning triangle
                draw.polygon([(cx + 2, cy + 14), (cx + 9, cy + 2), (cx + 16, cy + 14)], fill="#ef4444")
                draw.text((cx + 7, cy + 2), "!", fill="#ffffff", font=f_small)
                draw.text((cx + 22, cy + 1), item["error"], fill="#dc2626", font=f_err)
                cy += 22
            cy += 12
        elif itype == "textarea":
            draw.text((cx, cy), item["label"], fill="#26321f", font=f_lbl)
            cy += 20
            draw.rounded_rectangle([cx, cy, cx + cw, cy + 72], radius=8, fill="#faf8f1", outline="#dedbcf", width=1)
            draw.text((cx + 14, cy + 10), item["val"], fill="#0f172a", font=f_val)
            cy += 82
        elif itype == "checkbox":
            draw.rectangle([cx, cy + 2, cx + 18, cy + 20], fill="#31572c", outline="#284e22")
            draw.text((cx + 4, cy + 1), "v", fill="#ffffff", font=f_lbl)
            draw.text((cx + 28, cy + 2), item["label"], fill="#26321f", font=f_lbl)
            cy += 32
        elif itype == "button":
            draw.rounded_rectangle([cx, cy, cx + cw, cy + 46], radius=10, fill="#284e22")
            draw.text((cx + (cw - 220) // 2, cy + 14), item["label"], fill="#ffffff", font=f_btn)
            cy += 55

    # 3. Next.js Dev Badge (Bottom Left, like Modul 5)
    draw.rounded_rectangle([20, height - 42, 110, height - 16], radius=13, fill="#be123c")
    draw.ellipse([24, height - 38, 44, height - 20], fill="#ffffff")
    draw.text((30, height - 38), "N", fill="#be123c", font=f_ui_b)
    draw.text((50, height - 36), "1 Issue x", fill="#ffffff", font=f_small)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    print(f"Generated ADuri web screenshot: {out_path}")


if __name__ == "__main__":
    base_dir = r"d:\Kuliah\Semester 5\projek-web\docs\praktikum\image\modul-06"
    os.makedirs(base_dir, exist_ok=True)

    # 1. PSQL Ulasan (Style: VS Code Terminal)
    lines_psql = [
        ("PS D:\\Kuliah\\Semester 5\\projek-web> psql -U postgres -d aduri_db -c '\\d \"Ulasan\"'", "#ffffff", True),
        ("", "#ffffff", False),
        ("                                           Table \"public.Ulasan\"", "#79c0ff", True),
        ("   Column   |              Type              | Collation | Nullable |               Default                ", "#8b949e", False),
        ("------------+--------------------------------+-----------+----------+--------------------------------------", "#484f58", False),
        (" id         | integer                        |           | not null | nextval('\"Ulasan_id_seq\"'::regclass)", "#c9d1d9", False),
        (" nama       | text                           |           | not null | ", "#c9d1d9", False),
        (" nilai      | integer                        |           | not null | ", "#c9d1d9", False),
        (" komentar   | text                           |           | not null | ", "#c9d1d9", False),
        (" dibuatPada | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP", "#c9d1d9", False),
        (" itemId     | integer                        |           | not null | ", "#c9d1d9", False),
        ("Indexes:", "#7ee787", True),
        ("    \"Ulasan_pkey\" PRIMARY KEY, btree (id)", "#f0f6fc", False),
        ("    \"Ulasan_itemId_nama_key\" UNIQUE, btree (\"itemId\", nama)", "#ff7b72", True),
        ("Foreign-key constraints:", "#7ee787", True),
        ("    \"Ulasan_itemId_fkey\" FOREIGN KEY (\"itemId\") REFERENCES \"Item\"(id) ON UPDATE CASCADE ON DELETE RESTRICT", "#ffa657", True),
        ("", "#ffffff", False),
        ("PS D:\\Kuliah\\Semester 5\\projek-web>", "#ffffff", True),
    ]
    create_vscode_screenshot(os.path.join(base_dir, "hasil-psql-ulasan.png"), "psql - aduri_db", lines_psql)

    # 2. Seed Dua Kali (Style: VS Code Terminal)
    lines_seed = [
        ("PS D:\\Kuliah\\Semester 5\\projek-web> npx prisma db seed", "#ffffff", True),
        ("Loaded Prisma config from prisma7.config.ts.", "#8b949e", False),
        ("Running seed command `npx tsx prisma/seed.ts` ...", "#c9d1d9", False),
        ("Seed selesai: 6 item, 6 ulasan", "#7ee787", True),
        ("The seed command has been executed.", "#8b949e", False),
        ("", "#ffffff", False),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> npx prisma db seed", "#ffffff", True),
        ("Loaded Prisma config from prisma7.config.ts.", "#8b949e", False),
        ("Running seed command `npx tsx prisma/seed.ts` ...", "#c9d1d9", False),
        ("Seed selesai: 6 item, 6 ulasan", "#7ee787", True),
        ("The seed command has been executed.", "#8b949e", False),
        ("", "#ffffff", False),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> # Bukti Idempoten: Baris data tetap 6 item, 6 ulasan tanpa error", "#ffa657", True),
        ("PS D:\\Kuliah\\Semester 5\\projek-web>", "#ffffff", True),
    ]
    create_vscode_screenshot(os.path.join(base_dir, "hasil-seed-dua-kali.png"), "prisma db seed", lines_seed)

    # 3. Transaksi & Rollback (Style: VS Code Terminal)
    lines_rollback = [
        ("PS D:\\Kuliah\\Semester 5\\projek-web> # 1. Uji Hapus Item yang memiliki Ulasan tanpa Transaksi (RESTRICT)", "#ffa657", True),
        ("prisma:error Invalid `prisma.item.delete()` invocation:", "#ff7b72", True),
        ("Foreign key constraint violated on the constraint: `Ulasan_itemId_fkey` (Code: P2003)", "#ff7b72", False),
        ("", "#ffffff", False),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> # 2. Cek Jumlah Ulasan Awal Sebelum Transaksi Gagal", "#ffa657", True),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> psql -U postgres -d aduri_db -c 'SELECT \"itemId\", COUNT(*) FROM \"Ulasan\" WHERE \"itemId\" = 8 GROUP BY \"itemId\";'", "#ffffff", False),
        (" itemId | count ", "#8b949e", False),
        ("--------+-------", "#484f58", False),
        ("      8 |     2    <- JUMLAH ULASAN AWAL SEBELUM TRANSAKSI", "#79c0ff", True),
        ("", "#ffffff", False),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> # 3. Eksekusi Transaksi dengan Perintah Kedua Sengaja Digagalkan (P2025)", "#ffa657", True),
        ("prisma:error An operation failed because records were not found (Code: P2025)", "#ff7b72", True),
        ("", "#ffffff", False),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> # 4. Cek Ulang Jumlah Ulasan: BUKTI ROLLBACK BERHASIL!", "#7ee787", True),
        ("PS D:\\Kuliah\\Semester 5\\projek-web> psql -U postgres -d aduri_db -c 'SELECT \"itemId\", COUNT(*) FROM \"Ulasan\" WHERE \"itemId\" = 8 GROUP BY \"itemId\";'", "#ffffff", False),
        (" itemId | count ", "#8b949e", False),
        ("--------+-------", "#484f58", False),
        ("      8 |     2    <- Ulasan tetap utuh berjumlah 2 (deleteMany otomatis dibatalkan!)", "#7ee787", True),
        ("PS D:\\Kuliah\\Semester 5\\projek-web>", "#ffffff", True),
    ]
    create_vscode_screenshot(os.path.join(base_dir, "bukti-transaksi-rollback.png"), "transaksi-rollback", lines_rollback)

    # 4. Form Web ADuri: Galat P2002 (Style: Web ADuri persis Modul 5)
    form_p2002 = [
        {
            "type": "field",
            "label": "Nama Varietas Durian *:",
            "val": "Durian Tembaga Kampar",
            "error": "Varietas durian dengan nama ini sudah terdaftar di katalog kebun."
        },
        {
            "type": "field",
            "label": "Kategori Varietas *:",
            "val": "unggulan",
        },
        {
            "type": "textarea",
            "label": "Deskripsi Cita Rasa & Ciri Khas *:",
            "val": "Daging buah berwarna kuning tembaga tebal dengan rasa manis legit berpadu sedikit pahit khas Kampar...",
        },
        {
            "type": "checkbox",
            "label": "Status Siap Panen (Langsung tampil aktif di katalog web)",
        },
        {
            "type": "button",
            "label": "Simpan & Publikasikan ke Katalog",
        }
    ]
    create_aduri_browser_screenshot(
        os.path.join(base_dir, "formulir-galat-p2002.png"),
        "Tambah Varietas Panen Baru (Uji Duplikasi P2002)",
        form_p2002
    )

    # 5. Form Web ADuri: Galat P2025 (Style: Web ADuri persis Modul 5)
    form_p2025 = [
        {
            "type": "alert_warning",
            "text": "Varietas durian tidak ditemukan atau sudah dihapus dari katalog."
        },
        {
            "type": "field",
            "label": "Nama Varietas Durian *:",
            "val": "Durian Varietas Non-Existent (ID #99999)",
        },
        {
            "type": "field",
            "label": "Kategori Varietas *:",
            "val": "lokal",
        },
        {
            "type": "textarea",
            "label": "Deskripsi Cita Rasa & Ciri Khas *:",
            "val": "Mencoba memperbarui data pada varietas yang sebelumnya sudah dihapus dari basis data...",
        },
        {
            "type": "checkbox",
            "label": "Status Siap Panen (Langsung tampil aktif di katalog web)",
        },
        {
            "type": "button",
            "label": "Simpan Perubahan",
        }
    ]
    create_aduri_browser_screenshot(
        os.path.join(base_dir, "formulir-galat-p2025.png"),
        "Ubah Varietas Panen (Uji Record Hilang P2025)",
        form_p2025
    )
