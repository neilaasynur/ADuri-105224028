import os
from PIL import Image, ImageDraw, ImageFont

def create_erd_image(output_path):
    width, height = 1440, 880
    img = Image.new("RGBA", (width, height), "#0f172a")
    draw = ImageDraw.Draw(img)

    # Load Fonts
    font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)
    font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 13)
    font_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
    font_th = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 18)
    font_tag = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 11)
    font_col_b = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 13)
    font_col = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
    font_mono = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 12)
    font_mini = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 10)
    font_foot = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 12)
    font_foot_b = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 12)

    # Header
    title_text = "DIAGRAM RELASI ENTITAS (ERD) — ITEM & ULASAN"
    draw.text((60, 40), title_text, fill="#ffffff", font=font_title)
    
    # PostgreSQL Badge
    badge_x = 760
    draw.rounded_rectangle([badge_x, 42, badge_x + 160, 72], radius=6, fill="#336791", outline="#5b92bd", width=1)
    draw.text((badge_x + 14, 48), "POSTGRESQL 18", fill="#ffffff", font=font_badge)

    sub_text = "Aplikasi ADuri • Praktikum Pengembangan Aplikasi Web 2026 • Modul 6"
    draw.text((60, 78), sub_text, fill="#94a3b8", font=font_sub)

    # Coordinates
    t1_x, t1_y, t1_w = 60, 140, 490
    t2_x, t2_y, t2_w = 890, 140, 490
    row_h = 44

    # Table 1: Item
    cols_item = [
        ("PK", "id", "SERIAL", "PRIMARY KEY (Item_pkey)", "#f59e0b", "#fbbf24"),
        ("UQ", "judul", "TEXT", "UNIQUE (Item_judul_key)", "#ec4899", "#f472b6"),
        ("", "kategori", "Kategori (ENUM)", "NOT NULL", None, "#f8fafc"),
        ("", "deskripsi", "TEXT", "NOT NULL", None, "#f8fafc"),
        ("", "tersedia", "BOOLEAN", "DEFAULT TRUE", None, "#f8fafc"),
        ("", "gambar", "TEXT", "NULLABLE", None, "#94a3b8"),
        ("", "dibuatPada", "TIMESTAMP(3)", "DEFAULT NOW()", None, "#94a3b8"),
    ]

    # Table 2: Ulasan
    cols_ulasan = [
        ("PK", "id", "SERIAL", "PRIMARY KEY (Ulasan_pkey)", "#f59e0b", "#fbbf24"),
        ("FK", "itemId", "INTEGER", "REFERENCES Item(id)", "#06b6d4", "#38bdf8"),
        ("UQ", "nama", "TEXT", "COMPOSITE UNIQUE 1/2", "#ec4899", "#f472b6"),
        ("", "nilai", "INTEGER", "CHECK 1 - 5 (BINTANG)", None, "#f8fafc"),
        ("", "komentar", "TEXT", "NOT NULL", None, "#f8fafc"),
        ("", "dibuatPada", "TIMESTAMP(3)", "DEFAULT NOW()", None, "#94a3b8"),
    ]

    def draw_table(x, y, w, title, tag, header_color, border_header, cols):
        tot_h = 56 + len(cols) * row_h
        draw.rounded_rectangle([x + 4, y + 4, x + w + 4, y + tot_h + 4], radius=12, fill="#080e1a")
        draw.rounded_rectangle([x, y, x + w, y + tot_h], radius=12, fill="#1e293b", outline="#334155", width=1)
        
        draw.rounded_rectangle([x, y, x + w, y + 54], radius=12, fill=header_color)
        draw.rectangle([x, y + 42, x + w, y + 54], fill=header_color)
        draw.line([x, y + 54, x + w, y + 54], fill=border_header, width=1)
        
        draw.text((x + 20, y + 16), title, fill="#ffffff", font=font_th)
        draw.rounded_rectangle([x + w - 140, y + 16, x + w - 18, y + 38], radius=4, fill="#00000044")
        draw.text((x + w - 130, y + 20), tag, fill="#e2e8f0", font=font_tag)

        curr_y = y + 55
        for i, (badge, name, ctype, meta, b_col, name_col) in enumerate(cols):
            row_bg = "#1e293b" if i % 2 == 0 else "#192435"
            draw.rectangle([x + 1, curr_y, x + w - 1, curr_y + row_h], fill=row_bg)
            draw.line([x + 1, curr_y + row_h, x + w - 1, curr_y + row_h], fill="#334155", width=1)

            if badge:
                draw.rounded_rectangle([x + 16, curr_y + 11, x + 44, curr_y + 31], radius=4, fill=b_col)
                draw.text((x + 22, curr_y + 14), badge, fill="#0f172a", font=font_mini)

            draw.text((x + 56, curr_y + 12), name, fill=name_col, font=font_mono)
            draw.text((x + 210, curr_y + 13), ctype, fill="#94a3b8", font=font_mono)
            draw.text((x + 335, curr_y + 14), meta, fill="#64748b", font=font_col)

            curr_y += row_h

    draw_table(t1_x, t1_y, t1_w, "Item", "TABEL INDUK (1)", "#0284c7", "#38bdf8", cols_item)
    draw_table(t2_x, t2_y, t2_w, "Ulasan", "TABEL ANAK (N)", "#059669", "#34d399", cols_ulasan)

    # Connecting line
    p1_x = t1_x + t1_w
    p1_y = t1_y + 55 + (row_h // 2) # from 'id'
    
    p2_x = t2_x
    p2_y = t2_y + 55 + row_h + (row_h // 2) # to 'itemId'

    mid_x = (p1_x + p2_x) // 2

    draw.line([p1_x, p1_y, mid_x, p1_y], fill="#38bdf8", width=3)
    draw.line([mid_x, p1_y, mid_x, p2_y], fill="#38bdf8", width=3)
    draw.line([mid_x, p2_y, p2_x, p2_y], fill="#38bdf8", width=3)

    # 1 side notation
    draw.line([p1_x + 12, p1_y - 12, p1_x + 12, p1_y + 12], fill="#38bdf8", width=3)
    draw.line([p1_x + 20, p1_y - 12, p1_x + 20, p1_y + 12], fill="#38bdf8", width=3)

    # N side notation (Crow's foot)
    draw.line([p2_x, p2_y, p2_x - 18, p2_y - 14], fill="#38bdf8", width=3)
    draw.line([p2_x, p2_y, p2_x - 18, p2_y + 14], fill="#38bdf8", width=3)
    draw.line([p2_x - 18, p2_y - 14, p2_x - 18, p2_y + 14], fill="#38bdf8", width=3)

    # Center Badge
    pill_cx = mid_x
    pill_cy = (p1_y + p2_y) // 2
    pw, ph = 260, 58
    draw.rounded_rectangle([pill_cx - pw//2, pill_cy - ph//2, pill_cx + pw//2, pill_cy + ph//2], radius=10, fill="#1e293b", outline="#38bdf8", width=2)
    draw.text((pill_cx - 96, pill_cy - 18), "Relasi 1 : N (One-to-Many)", fill="#ffffff", font=font_col_b)
    draw.text((pill_cx - 78, pill_cy + 3), "ON DELETE RESTRICT", fill="#38bdf8", font=font_col_b)

    # Footer Banner
    foot_y = 690
    draw.rounded_rectangle([60, foot_y, 1380, foot_y + 90], radius=10, fill="#1e293b", outline="#334155", width=1)
    
    draw.text((80, foot_y + 16), "Integritas Referensial (Foreign Key):", fill="#94a3b8", font=font_foot)
    draw.text((80, foot_y + 36), 'FOREIGN KEY ("itemId") REFERENCES "Item"(id) ON UPDATE CASCADE ON DELETE RESTRICT', fill="#38bdf8", font=font_foot_b)

    draw.text((80, foot_y + 60), "Indeks Unik (Unique Constraints):", fill="#94a3b8", font=font_foot)
    draw.text((280, foot_y + 60), 'Item_judul_key (Item.judul)  &  Ulasan_itemId_nama_key (itemId, nama)', fill="#ec4899", font=font_foot_b)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG", quality=95)
    print(f"ERD Image successfully generated at: {output_path}")

if __name__ == "__main__":
    out_file = r"d:\Kuliah\Semester 5\projek-web\docs\praktikum\image\modul-06\erd-item-ulasan.png"
    create_erd_image(out_file)
