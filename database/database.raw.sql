INSERT INTO `order_status` (`statusCode`, `statusReason`, `description`)
VALUES 
  ('0', 'INIT', 'Đơn hàng vừa được khởi tạo'),
  ('1', 'ACCEPTED', 'Đơn hàng đang được xử lý'),
  ('2', 'SHIPPING ', 'Đơn hàng đang được vận chuyển'),
  ('3', 'FINISHED', 'Đơn hàng đã hoàn thành'),
  ('4', 'CANCEL', 'Đơn hàng đã bị hủy'),
  ('5', 'REJECTED', 'Đơn hàng đã bị từ chối');

INSERT INTO `category` ( `name`)
VALUES
  ('Đồ ăn'),
  ('Đồ uống'),
  ('Đồ chay'),
  ('Bánh kem'),
  ('Tráng miệng'),
  ('Homemade'),
  ('Vỉa hè'),
  ('Pizza/Burger'),
  ('Món gà'),
  ('Món lẩu'),
  ('Sushi'),
  ('Mì phở'),
  ('Cơm hộp');


INSERT INTO `shop` (`name`, `address`, `phone`, `image`, `isWorking`) 
VALUES 
('Donald Trung - Bánh Ướt & Bánh Cuốn Thịt Heo', '28 Hoàng Văn Thụ, P. An Đông, Tp. Huế, Huế', '0123456789', 'https://mms.img.susercontent.com/vn-11134513-7r98o-lsu0ypz4mh8k22@resize_ss640x400!@crop_w640_h400_cT', '1'),
('1985BBQ - 2 Bà Triệu (Nướng Lẩu-Ăn Vặt Và Trà Sữa)', '2 Bà Triệu, P. Phú Hội, Tp. Huế, Huế', '0123456789', 'https://example.com/image2.jpg', '1'),
('Gà rán và Mì Ý - Jollibee - Hùng Vương', 'Tầng 4, Tầng 4, Vincom Plaza, 50A Hùng Vương, P. Phú Nhuận, Tp. Huế, Huế', '0123456789', 'https://example.com/image3.jpg', '1'),
('Đặc Sản Xứ Quảng - Mì Quảng & Bún Mắm', '103/19 Nguyễn Trường Tộ, P. Vĩnh Ninh, Tp. Huế, Huế', '0123456789', 'https://example.com/image4.jpg', '1'),
('Alpha Go - Fast Food & More - Nguyễn Huệ', '138 Nguyễn Huệ, P. Phú Nhuận, Tp. Huế, Huế', '0123456789', 'https://example.com/image5.jpg', '1');
