export interface FoodItem {
    id: number;
    name: string;
    carbs: number; // g per 100g (or per unit if unit is fixed)
    unit: string;
    absorption: 'rapida' | 'media' | 'lenta';
    fatProteinAlert?: boolean; // New flag for Pizza effect
    category: 'Lacteos' | 'Cereales' | 'Frutas' | 'Verduras' | 'Legumbres' | 'Bebidas' | 'Otros';
}

export const FOOD_DATABASE: FoodItem[] = [
    // --- LÁCTEOS (IG Bajo/Medio) ---
    { id: 101, name: 'Leche entera/semi/desnatada', carbs: 5, unit: 'g HC por 100ml', absorption: 'media', category: 'Lacteos' },
    { id: 102, name: 'Yogur Natural (Sin azúcar)', carbs: 5, unit: 'g HC por 125g (1 unidad)', absorption: 'media', category: 'Lacteos' },
    { id: 110, name: 'Yogur Sabores / Edulcorado', carbs: 14, unit: 'g HC por 125g (1 unidad)', absorption: 'rapida', category: 'Lacteos' },
    { id: 103, name: 'Yogur líquido', carbs: 11, unit: 'g HC por 100ml', absorption: 'rapida', category: 'Lacteos' },
    { id: 104, name: 'Cuajada', carbs: 10, unit: 'g HC por 1 unidad', absorption: 'media', category: 'Lacteos' },
    { id: 105, name: 'Kéfir', carbs: 5, unit: 'g HC por 100g', absorption: 'media', category: 'Lacteos' },

    // --- CEREALES, TUBÉRCULOS Y HARINAS ---
    { id: 220, name: 'Tapioca / Yuca (Cocida)', carbs: 38, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' }, // High carb
    { id: 201, name: 'Pan Blanco (Barra)', carbs: 55, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 202, name: 'Pan Integral', carbs: 45, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 203, name: 'Pan de Molde Blanco', carbs: 48, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 204, name: 'Pan de Molde Integral', carbs: 43, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 205, name: 'Arroz Blanco (Cocido)', carbs: 28, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 206, name: 'Arroz Integral (Cocido)', carbs: 26, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 207, name: 'Pasta (Cocida)', carbs: 25, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' }, // Al dente es lenta/media
    { id: 221, name: 'Pasta Sopa/Maravilla (Seca)', carbs: 72, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' }, // Se pesa en seco
    { id: 222, name: 'Cuscús (Cocido)', carbs: 23, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 223, name: 'Quinoa (Cocida)', carbs: 21, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 224, name: 'Harina de Trigo', carbs: 70, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 225, name: 'Pan Tostado / Biscotes', carbs: 75, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 226, name: 'Tortitas Maíz/Arroz', carbs: 80, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 208, name: 'Patata (Cocida)', carbs: 20, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 209, name: 'Patata (Frita)', carbs: 35, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Cereales' }, // Grasa retrasa absorción
    { id: 210, name: 'Pizza (Masa fina)', carbs: 30, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Cereales' },
    { id: 211, name: 'Avena (Copos)', carbs: 60, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 212, name: 'Cereales Desayuno (Azucarados)', carbs: 80, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 213, name: 'Cereales Desayuno (Integrales)', carbs: 65, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 214, name: 'Galletas María', carbs: 70, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 215, name: 'Galletas Digestivas/Integrales', carbs: 65, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },
    { id: 216, name: 'Churros', carbs: 40, unit: 'g HC por 100g', absorption: 'rapida', fatProteinAlert: true, category: 'Cereales' },

    // --- LEGUMBRES (IG Bajo - Lenta) ---
    { id: 301, name: 'Lentejas (Cocidas)', carbs: 20, unit: 'g HC por 100g', absorption: 'lenta', category: 'Legumbres' },
    { id: 302, name: 'Garbanzos (Cocidos)', carbs: 20, unit: 'g HC por 100g', absorption: 'lenta', category: 'Legumbres' },
    { id: 303, name: 'Alubias/Judías (Cocidas)', carbs: 18, unit: 'g HC por 100g', absorption: 'lenta', category: 'Legumbres' },
    { id: 304, name: 'Guisantes (Cocidos)', carbs: 10, unit: 'g HC por 100g', absorption: 'media', category: 'Legumbres' },
    { id: 305, name: 'Habas (Cocidas)', carbs: 12, unit: 'g HC por 100g', absorption: 'lenta', category: 'Legumbres' },

    // --- FRUTAS (IG Variable) ---
    { id: 401, name: 'Manzana (con piel)', carbs: 12, unit: 'g HC por 100g', absorption: 'lenta', category: 'Frutas' },
    { id: 402, name: 'Plátano (Maduro)', carbs: 23, unit: 'g HC por 100g', absorption: 'rapida', category: 'Frutas' },
    { id: 403, name: 'Plátano (Verde)', carbs: 20, unit: 'g HC por 100g', absorption: 'media', category: 'Frutas' },
    { id: 404, name: 'Pera', carbs: 11, unit: 'g HC por 100g', absorption: 'lenta', category: 'Frutas' },
    { id: 405, name: 'Naranja', carbs: 9, unit: 'g HC por 100g', absorption: 'media', category: 'Frutas' },
    { id: 406, name: 'Mandarina', carbs: 9, unit: 'g HC por 100g', absorption: 'media', category: 'Frutas' },
    { id: 407, name: 'Uvas', carbs: 16, unit: 'g HC por 100g', absorption: 'rapida', category: 'Frutas' },
    { id: 408, name: 'Sandía', carbs: 6, unit: 'g HC por 100g', absorption: 'rapida', category: 'Frutas' }, // IG Alto pero carga baja
    { id: 409, name: 'Melón', carbs: 6, unit: 'g HC por 100g', absorption: 'rapida', category: 'Frutas' },
    { id: 410, name: 'Fresas', carbs: 7, unit: 'g HC por 100g', absorption: 'lenta', category: 'Frutas' },
    { id: 411, name: 'Cerezas', carbs: 12, unit: 'g HC por 100g', absorption: 'lenta', category: 'Frutas' },
    { id: 412, name: 'Melocotón', carbs: 9, unit: 'g HC por 100g', absorption: 'media', category: 'Frutas' },
    { id: 413, name: 'Kiwi', carbs: 11, unit: 'g HC por 100g', absorption: 'media', category: 'Frutas' },

    // --- HORTALIZAS (Pocos HC, pero cuentan en cantidad) ---
    { id: 501, name: 'Zanahoria (Cocida)', carbs: 7, unit: 'g HC por 100g', absorption: 'media', category: 'Verduras' },
    { id: 502, name: 'Zanahoria (Cruda)', carbs: 7, unit: 'g HC por 100g', absorption: 'lenta', category: 'Verduras' },
    { id: 503, name: 'Tomate', carbs: 3, unit: 'g HC por 100g', absorption: 'lenta', category: 'Verduras' },
    { id: 504, name: 'Maíz dulce (Lata)', carbs: 20, unit: 'g HC por 100g', absorption: 'media', category: 'Verduras' },

    // --- BEBIDAS Y OTROS ---
    { id: 601, name: 'Zumo de Naranja (Natural)', carbs: 10, unit: 'g HC por 100ml', absorption: 'rapida', category: 'Bebidas' },
    { id: 602, name: 'Refresco Cola (Normal)', carbs: 11, unit: 'g HC por 100ml', absorption: 'rapida', category: 'Bebidas' },
    { id: 603, name: 'Bebida de Soja', carbs: 4, unit: 'g HC por 100ml', absorption: 'lenta', category: 'Bebidas' },
    { id: 604, name: 'Azúcar Blanco', carbs: 100, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 605, name: 'Miel', carbs: 80, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 606, name: 'Helado Cremoso', carbs: 25, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' }, // Grasa
    { id: 607, name: 'Chocolate con leche', carbs: 55, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },

    // --- PLATOS PREPARADOS TÍPICOS ---
    { id: 701, name: 'Tortilla de Patata', carbs: 12, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 702, name: 'Croquetas', carbs: 22, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 703, name: 'Paella Mixta', carbs: 20, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 704, name: 'Lasaña / Canelones', carbs: 18, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 705, name: 'Gazpacho', carbs: 4, unit: 'g HC por 100ml', absorption: 'media', category: 'Verduras' },
    { id: 706, name: 'Hamburguesa (Completa con pan)', carbs: 30, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' }, // Grasa y Proteina
    { id: 707, name: 'Kebab (con pan pita)', carbs: 25, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 708, name: 'Sushi (Makis/Nigiris)', carbs: 35, unit: 'g HC por 100g', absorption: 'media', category: 'Cereales' },

    // --- FRUTOS SECOS Y SNACKS ---
    { id: 801, name: 'Nueces/Almendras', carbs: 4, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 802, name: 'Patatas Chips (Bolsa)', carbs: 50, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 803, name: 'Palomitas de Maíz', carbs: 60, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
    { id: 804, name: 'Kikos (Maíz frito)', carbs: 65, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },

    // --- BOLLERÍA Y DULCES ---
    { id: 901, name: 'Croissant', carbs: 45, unit: 'g HC por 100g', absorption: 'rapida', fatProteinAlert: true, category: 'Otros' },
    { id: 902, name: 'Magdalena', carbs: 50, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 903, name: 'Donut / Berlina', carbs: 50, unit: 'g HC por 100g', absorption: 'rapida', fatProteinAlert: true, category: 'Otros' },
    { id: 904, name: 'Chocolate Negro (>70%)', carbs: 35, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 905, name: 'Cacao Soluble (ColaCao/Nesquik)', carbs: 75, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 906, name: 'Mermelada', carbs: 60, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },

    // --- MÁS FRUTAS Y VERDURAS ---
    { id: 414, name: 'Piña', carbs: 12, unit: 'g HC por 100g', absorption: 'media', category: 'Frutas' },
    { id: 415, name: 'Ciruelas', carbs: 11, unit: 'g HC por 100g', absorption: 'rapida', category: 'Frutas' },
    { id: 416, name: 'Higos', carbs: 16, unit: 'g HC por 100g', absorption: 'rapida', category: 'Frutas' },
    { id: 417, name: 'Aguacate', carbs: 1, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Frutas' }, // Grasa saludable
    { id: 505, name: 'Puré de Patatas', carbs: 15, unit: 'g HC por 100g', absorption: 'rapida', category: 'Verduras' },
    { id: 506, name: 'Boniato / Batata', carbs: 24, unit: 'g HC por 100g', absorption: 'media', category: 'Verduras' },

    // --- SALSAS ---
    { id: 950, name: 'Ketchup', carbs: 25, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 951, name: 'Mayonesa', carbs: 1, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },

    // --- SNACKS INFANTILES Y CHUCHES ---
    { id: 1001, name: 'Flash (Polo de hielo)', carbs: 15, unit: 'g HC por 100ml', absorption: 'rapida', category: 'Otros' },
    { id: 1002, name: 'Polo de Limón/Fresa', carbs: 20, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 1003, name: 'Gusanitos (Maíz horneado)', carbs: 65, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 1004, name: 'Pipas Saladas (con cáscara)', carbs: 3, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 1005, name: 'Gominolas / Chuches', carbs: 80, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 1006, name: 'Piruleta', carbs: 95, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 1007, name: 'Galletas de chocolate (Oreo/Rellenas)', carbs: 68, unit: 'g HC por 100g', absorption: 'media', category: 'Otros' },
    { id: 1008, name: 'Bollycao / Pan de leche relleno', carbs: 48, unit: 'g HC por 100g', absorption: 'media', category: 'Otros' },
    { id: 1009, name: 'Palomitas (Bolsa cine)', carbs: 60, unit: 'g HC por 100g', absorption: 'rapida', category: 'Otros' },
    { id: 1010, name: 'Helado de cono (Tipo Cornetto)', carbs: 32, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 1011, name: 'Sobao Pasiego', carbs: 50, unit: 'g HC por 100g', absorption: 'rapida', fatProteinAlert: true, category: 'Otros' },
    { id: 1012, name: 'Natillas', carbs: 18, unit: 'g HC por 100g', absorption: 'media', category: 'Lacteos' },
    { id: 1013, name: 'Arroz con leche', carbs: 22, unit: 'g HC por 100g', absorption: 'media', category: 'Lacteos' },
    { id: 1014, name: 'Nocilla / Nutella', carbs: 55, unit: 'g HC por 100g', absorption: 'lenta', fatProteinAlert: true, category: 'Otros' },
    { id: 1015, name: 'Pan de leche / Brioche', carbs: 45, unit: 'g HC por 100g', absorption: 'rapida', category: 'Cereales' },
];
