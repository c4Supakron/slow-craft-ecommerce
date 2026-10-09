import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'เครื่องบดกาแฟมือหมุน สแตนเลส Timemore C3',
    description: 'เครื่องบดกาแฟพกพา เฟืองสแตนเลส S2C ปรับระดับความละเอียดได้ แม่นยำ ทนทาน พกพาสะดวก',
    price: 1590,
    category: 'อุปกรณ์กาแฟ',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-002',
    name: 'ดริปเปอร์กาแฟเซรามิก V60 พร้อมฐานรองไม้',
    description: 'ดริปเปอร์ทรงกรวย ดึงรสชาติและบอดี้ของกาแฟได้สมบูรณ์แบบ ล้างทำความสะอาดง่าย ดีไซน์มินิมอล',
    price: 490,
    category: 'อุปกรณ์กาแฟ',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-003',
    name: 'กาต้มน้ำดริป คอห่าน สแตนเลส 304 ขนาด 600ml',
    description: 'ควบคุมสายน้ำได้นิ่ง สม่ำเสมอ เหมาะสำหรับการชงกาแฟดริปแบบมืออาชีพ ด้ามจับไม้กันร้อน',
    price: 790,
    category: 'อุปกรณ์กาแฟ',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-004',
    name: 'แก้วกาแฟ Double Wall ทนความร้อน 350ml',
    description: 'แก้วสองชั้นจับไม่ร้อนมือ กักเก็บอุณหภูมิได้ยาวนาน ดีไซน์เรียบหรู เข้าได้กับทุกโต๊ะทำงาน',
    price: 290,
    category: 'ของแต่งบ้าน',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-005',
    name: 'เมล็ดกาแฟ Special blend คั่วกลาง แม่จันใต้ 250g',
    description: 'โทน Floral & Stone Fruit บอดี้กลมกล่อม หอมละมุน ชงได้ทั้ง Filter และ Espresso คั่วสดใหม่',
    price: 320,
    category: 'เมล็ดกาแฟ',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prod-006',
    name: 'เครื่องชั่งดิจิตอลสำหรับกาแฟ จับเวลาในตัว Precision 0.1g',
    description: 'เซนเซอร์ความแม่นยำสูง หน้าจอ LED ชัดเจน จับเวลาพร้อมชั่งน้ำหนัก ชาร์จ USB Type-C',
    price: 890,
    category: 'อุปกรณ์กาแฟ',
    stock: 0, // Out of stock example to verify badge & disabled button
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
  },
];
