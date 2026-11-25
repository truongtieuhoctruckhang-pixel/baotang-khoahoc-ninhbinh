export type QuestionType =
  | 'single'
  | 'multi'
  | 'truefalse'
  | 'short'
  | 'match'
  | 'order'
  | 'balance';

export interface CauHoi {
  type?: QuestionType;
  cauHoi: string;
  imageUrl?: string;
  shuffleOptions?: boolean;
  dapAn?: string[];
  dapAnDung?: number;
  dapAnDungMulti?: number[];
  statements?: { text: string; isTrue: boolean }[];
  shortAnswers?: string[];
  pairs?: { a: string; b: string }[];
  orderSteps?: string[];
  balanceEquation?: string;
  balanceCoefficients?: number[];
  giaiThich: string;
}

export interface KienThucKhoaHoc {
  linhVuc: string;
  tomTat: string;
  diemNhan: string[];
  phuongTrinh: string;
  giaiThichPhuongTrinh: string;
}

export interface TramDiSan {
  id: string; // '01' .. '12' — dùng cho đường dẫn #/tram/01 ... #/tram/12
  soThuTu: number;
  cumId: 'cum-1' | 'cum-2' | 'cum-3';
  cum: string;
  ten: string;
  diaPhuong: string;
  anh: string;
  moTaNgan: string;
  kienThuc: KienThucKhoaHoc;
  video: {
    youtubeId: string; // Mã video YouTube (11 ký tự)
    tieuDe: string;
    thoiLuong: string;
  };
  autoplay?: boolean;
  cauHoi: CauHoi[];
}

export interface CumTram {
  id: 'cum-1' | 'cum-2' | 'cum-3';
  soThuTu: string;
  ten: string;
  chuDe: string;
  moTa: string;
  mauDau: string;
}

export interface DanhHieu {
  id: string;
  mocTram: number;
  ten: string;
  moTa: string;
}

export interface TeamMember {
  hoTen: string;
  vaiTro: string;
}

export interface HeroSlide {
  url: string;
  nhan: string;
}

export interface ProjectInfo {
  tenDuAn: string;
  tenPhu: string;
  khauHieu: string;
  anhBia: string;
  heroSlides: HeroSlide[];
  nhomThucHien: {
    tenNhom: string;
    donVi: string;
    gioiThieu: string;
    thanhVien: TeamMember[];
  };
}

export const PROJECT_INFO: ProjectInfo = {
  tenDuAn: 'HỘ CHIẾU DU LỊCH KHOA HỌC 4.0',
  tenPhu: 'Bảo Tàng Khoa Học Số: Di Sản & Tri Thức',
  khauHieu:
    'Chạm mã QR tại mỗi miền di sản — giải mã quy luật tự nhiên, sưu tầm dấu ấn tri thức STEM Việt Nam.',
  anhBia: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg',
  heroSlides: [
    { url: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg', nhan: 'Tràng An – Ninh Bình' },
    { url: '/src/assets/images/station_tamchuc_mountain_1795513152761.jpg', nhan: 'Tam Chúc – Hà Nam' },
    { url: '/src/assets/images/station_cucphuong_forest_1795513153287.jpg', nhan: 'Cúc Phương – Ninh Bình' },
  ],
  // TODO: kiểm tra lại — Cập nhật thông tin chính xác của nhóm thực hiện và trường học
  nhomThucHien: {
    tenNhom: 'Nhóm Nghiên Cứu STEM Di Sản & Tri Thức',
    donVi: 'Dự án thi Khoa học Kỹ thuật & STEM Cấp Quốc gia',
    gioiThieu:
      'Dự án kết hợp giữa bảo tồn di sản văn hóa – thiên nhiên vùng châu thổ sông Hồng (Hà Nam, Ninh Bình, Nam Định) với giáo dục STEM hiện đại thông qua mô hình hộ chiếu số tương tác trên thiết bị di động.',
    thanhVien: [
      { hoTen: 'Thành viên 01 (Cập nhật họ tên)', vaiTro: 'Nghiên cứu nội dung Địa chất – Hóa học' },
      { hoTen: 'Thành viên 02 (Cập nhật họ tên)', vaiTro: 'Thiết kế hệ thống QR & Bảo tàng số' },
      { hoTen: 'Giáo viên hướng dẫn (Cập nhật họ tên)', vaiTro: 'Cố vấn chuyên môn STEM' },
    ],
  },
};

export const CLUSTERS: CumTram[] = [
  {
    id: 'cum-1',
    soThuTu: 'Cụm 01',
    ten: 'Hà Nam & Ninh Bình',
    chuDe: 'Địa chất – Khoáng vật',
    moTa: 'Khám phá quá trình kiến tạo núi đá vôi trầm tích, phản ứng hòa tan tạo hang động Karst và cân bằng thủy văn hồ cổ.',
    mauDau: '#137A6F',
  },
  {
    id: 'cum-2',
    soThuTu: 'Cụm 02',
    ten: 'Ninh Bình Sinh Thái',
    chuDe: 'Đa dạng sinh học & Bảo tồn', // TODO: kiểm tra lại tên cụm
    moTa: 'Giải mã hệ sinh thái đất ngập nước, quang học tự nhiên trong hang động và thảm rừng nguyên sinh trên nền đá vôi.',
    mauDau: '#B07A1C',
  },
  {
    id: 'cum-3',
    soThuTu: 'Cụm 03',
    ten: 'Nam Định Di Sản & Biển',
    chuDe: 'Làng nghề – Vật liệu & Biển đảo', // TODO: kiểm tra lại tên cụm
    moTa: 'Tìm hiểu luyện kim đúc đồng Tống Xá, polyme tự nhiên, kết tinh muối biển và hệ sinh thái rừng ngập mặn Xuân Thủy.',
    mauDau: '#1F6F8B',
  },
];

export const DANH_HIEU: DanhHieu[] = [
  {
    id: 'explorer',
    mocTram: 3,
    ten: 'Nhà thám hiểm',
    moTa: 'Hoàn thành 3/12 trạm di sản đầu tiên trên hành trình khoa học.',
  },
  {
    id: 'young-scientist',
    mocTram: 6,
    ten: 'Nhà khoa học trẻ',
    moTa: 'Hoàn thành 6/12 trạm, làm chủ kiến thức liên môn Địa chất – Sinh – Hóa.',
  },
  {
    id: 'heritage-ambassador',
    mocTram: 12,
    ten: 'Đại sứ di sản',
    moTa: 'Chinh phục trọn vẹn 12/12 con dấu của Bảo tàng Khoa học Số.',
  },
];

/**
 * DANH SÁCH 12 TRẠM DI SẢN
 * Ghi chú: Các trạm đánh dấu "// TODO: kiểm tra lại" đang dùng nội dung mẫu khoa học
 * và ID video YouTube tham khảo để bạn dễ rà soát, thay thế khi hoàn thiện hồ sơ thi.
 */
export const STATIONS: TramDiSan[] = [
  // =========================================================================
  // CỤM 1: HÀ NAM & NINH BÌNH (ĐỊA CHẤT – KHOÁNG VẬT)
  // =========================================================================
  {
    // TODO: kiểm tra lại
    id: '01',
    soThuTu: 1,
    cumId: 'cum-1',
    cum: 'Hà Nam & Ninh Bình (Địa chất – Khoáng vật)',
    ten: 'Núi Ngăm – Dấu tích trầm tích cổ',
    diaPhuong: 'Thanh Liêm, Hà Nam',
    anh: '/src/assets/images/station_tamchuc_mountain_1795513152761.jpg',
    moTaNgan:
      'Ngọn núi đá trầm tích đứng bên dòng sông Đáy, lưu giữ dấu ấn vận động kiến tạo và phong hóa cơ – hóa học hàng trăm triệu năm.',
    kienThuc: {
      linhVuc: 'Địa chất học & Phong hóa',
      tomTat:
        'Núi Ngăm cấu tạo chủ yếu từ đá vôi và đá phiến sét trầm tích hình thành dưới đáy biển cổ đại. Qua thời gian, sự chênh lệch nhiệt độ ngày – đêm và nước mưa giàu oxy đã gây phong hóa cơ học kết hợp phong hóa hóa học, tạo nên các vách đá phân lớp rõ nét.',
      diemNhan: [
        'Đá trầm tích hình thành từ quá trình lắng đọng vật liệu qua hàng triệu năm.',
        'Phong hóa cơ học làm nứt vỡ đá do giãn nở nhiệt, không làm đổi thành phần hóa học.',
        'Khoáng vật canxit (CaCO₃) và dolomit CaMg(CO₃)₂ chiếm tỷ lệ lớn trong đá vôi vùng Hà Nam.',
      ],
      phuongTrinh: 'CaMg(CO₃)₂ + 2H₂O + 2CO₂ ⇌ Ca(HCO₃)₂ + Mg(HCO₃)₂',
      giaiThichPhuongTrinh:
        'Quá trình hòa tan chậm khoáng vật dolomit trong nước mưa chứa khí CO₂ hòa tan.',
    },
    video: {
      youtubeId: 'dQw4w9WgXcQ', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 01
      tieuDe: 'Khám phá địa tầng đá trầm tích tại Núi Ngăm',
      thoiLuong: '03:45',
    },
    cauHoi: [
      {
        cauHoi: 'Loại đá nào cấu tạo nên phần lớn dãy núi đá vùng chuyển tiếp Hà Nam – Ninh Bình?',
        dapAn: ['Đá bazan núi lửa', 'Đá vôi trầm tích', 'Đá hoa cương (granit)', 'Đá obsidian'],
        dapAnDung: 1,
        giaiThich:
          'Vùng núi Hà Nam – Ninh Bình thuộc hệ thống đá vôi trầm tích biển cổ, giàu khoáng vật canxit.',
      },
      {
        cauHoi: 'Hiện tượng đá bị nứt vỡ do thay đổi nhiệt độ ngày và đêm được gọi là gì?',
        dapAn: ['Phong hóa cơ học (vật lý)', 'Quang hợp', 'Nhiệt phân hóa học', 'Kết tinh muối'],
        dapAnDung: 0,
        giaiThich:
          'Sự co giãn nhiệt không đều làm phá vỡ liên kết cơ học của khối đá mà không biến đổi chất.',
      },
      {
        cauHoi: 'Thành phần hóa học chính của khoáng vật canxit trong đá vôi là gì?',
        dapAn: ['NaCl', 'SiO₂', 'CaCO₃', 'Fe₂O₃'],
        dapAnDung: 2,
        giaiThich: 'Canxit là dạng tinh thể phổ biến của canxi cacbonat (CaCO₃).',
      },
    ],
  },
  {
    id: '02',
    soThuTu: 2,
    cumId: 'cum-1',
    cum: 'Hà Nam & Ninh Bình (Địa chất – Khoáng vật)',
    ten: 'Tràng An – Miền di sản đá vôi',
    diaPhuong: 'Hoa Lư, Ninh Bình',
    anh: '/src/assets/images/station_karst_cave_1795513152972.jpg',
    moTaNgan:
      'Quần thể di sản thế giới nổi bật với hệ thống hang động xuyên thủy kỳ vĩ được chạm khắc bởi phản ứng hóa học tự nhiên.',
    kienThuc: {
      linhVuc: 'Hóa học vô cơ & Địa mạo Karst',
      tomTat:
        'Khi nước mưa hấp thụ khí CO₂ từ khí quyển và đất, nó tạo thành dung dịch axit cacbonic (H₂CO₃) yếu. Dòng nước này thấm qua khe nứt đá vôi, hòa tan CaCO₃ không tan thành muối Ca(HCO₃)₂ tan được, mở rộng dần thành các hang động xuyên thủy tại Tràng An.',
      diemNhan: [
        'Phản ứng thuận (từ trái sang phải) hòa tan đá vôi, hình thành lòng hang động.',
        'Khi giọt nước nhỏ từ trần hang, CO₂ thoát ra làm phản ứng đảo chiều, kết tủa lại CaCO₃ tạo thạch nhũ và măng đá.',
        'Quá trình này diễn ra liên tục suốt hàng triệu năm ở quy mô địa chất.',
      ],
      phuongTrinh: 'CaCO₃ (rắn) + H₂O (lỏng) + CO₂ (khí) ⇌ Ca(HCO₃)₂ (tan)',
      giaiThichPhuongTrinh:
        'Chiều thuận tạo hang động Karst; chiều nghịch kết tủa canxi cacbonat tạo thạch nhũ.',
    },
    video: {
      youtubeId: 'M7lc1UVf-VE', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 02
      tieuDe: 'Cơ chế hóa học hình thành hang động đá vôi Tràng An',
      thoiLuong: '04:20',
    },
    cauHoi: [
      {
        cauHoi: 'Phản ứng hóa học nào giải thích sự hình thành hang động đá vôi ở Tràng An?',
        dapAn: [
          'CaCO₃ tác dụng với nước chứa CO₂ tạo Ca(HCO₃)₂ tan',
          'CaCO₃ nhiệt phân ở nhiệt độ thường tạo CaO',
          'Đá vôi phản ứng trực tiếp với khí O₂ tạo ra hang',
          'Nước đóng băng làm tan chảy toàn bộ đá vôi',
        ],
        dapAnDung: 0,
        giaiThich:
          'Nước mưa chứa CO₂ hòa tan tạo môi trường axit yếu, chuyển CaCO₃ không tan thành Ca(HCO₃)₂ tan trong nước.',
      },
      {
        cauHoi: 'Thạch nhũ trên trần hang động được tạo thành do quá trình nào?',
        dapAn: [
          'Bay hơi nước muối biển tạo tinh thể NaCl',
          'Phản ứng nghịch phân hủy Ca(HCO₃)₂ kết tủa lại CaCO₃ khi mất CO₂',
          'Quá trình oxi hóa sắt trong đá vôi',
          'Sự lắng đọng cát thạch anh từ sông Hồng',
        ],
        dapAnDung: 1,
        giaiThich:
          'Khi dung dịch Ca(HCO₃)₂ mất CO₂ và bay hơi nước tại trần hang, CaCO₃ kết tinh dần thành thạch nhũ.',
      },
      {
        cauHoi: 'Khí nào trong không khí đóng vai trò quyết định giúp nước mưa hòa tan đá vôi mạnh hơn?',
        dapAn: ['Khí Nitơ (N₂)', 'Khí Heli (He)', 'Khí Cacbon đioxit (CO₂)', 'Khí Argon (Ar)'],
        dapAnDung: 2,
        giaiThich:
          'CO₂ hòa tan vào nước tạo axit cacbonic (H₂CO₃), làm tăng khả năng hòa tan khoáng vật cacbonat.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '03',
    soThuTu: 3,
    cumId: 'cum-1',
    cum: 'Hà Nam & Ninh Bình (Địa chất – Khoáng vật)',
    ten: 'Tam Chúc – Hồ Karst & Thủy văn',
    diaPhuong: 'Ba Sao, Kim Bảng, Hà Nam',
    anh: '/src/assets/images/station_tamchuc_mountain_1795513152761.jpg',
    moTaNgan:
      'Lòng chảo Karst ngập nước được ví như "Vịnh Hạ Long trên cạn", nơi hệ đệm cacbonat giữ cho nguồn nước luôn trong xanh ổn định.',
    kienThuc: {
      linhVuc: 'Thủy văn học & Hóa học dung dịch đệm',
      tomTat:
        'Hồ Tam Chúc nằm trong thung lũng đá vôi khép kín. Nhờ tiếp xúc thường xuyên với đá vôi giàu CaCO₃, nước hồ chứa hệ đệm bicacbonat (HCO₃⁻ / CO₃²⁻) giúp ổn định độ pH quanh mức 7,5 – 8,2, hạn chế tác động của mưa axit và hỗ trợ hệ thủy sinh phát triển.',
      diemNhan: [
        'Thung lũng Karst ngập nước tạo cảnh quan núi đảo soi bóng mặt hồ.',
        'Ion HCO₃⁻ đóng vai trò chất đệm trung hòa lượng axit dư trong nước mưa.',
        'Độ cứng tạm thời của nước đến từ ion Ca²⁺ và Mg²⁺ hòa tan từ núi đá vôi xung quanh.',
      ],
      phuongTrinh: 'CO₃²⁻ + H⁺ ⇌ HCO₃⁻  |  HCO₃⁻ + H⁺ ⇌ H₂CO₃',
      giaiThichPhuongTrinh:
        'Hệ đệm cacbonat giúp trung hòa axit, duy trì pH ổn định cho hồ nước vùng đá vôi.',
    },
    video: {
      youtubeId: 'dQw4w9WgXcQ', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 03
      tieuDe: 'Địa mạo thung lũng ngập nước và hệ đệm tự nhiên Tam Chúc',
      thoiLuong: '03:50',
    },
    cauHoi: [
      {
        cauHoi: 'Vì sao nước hồ nằm trên nền đá vôi như Tam Chúc ít bị axit hóa đột ngột khi có mưa axit?',
        dapAn: [
          'Nhờ hệ đệm cacbonat – bicacbonat trung hòa ion H⁺',
          'Vì nước hồ không hòa tan bất kỳ chất khí nào',
          'Do nhiệt độ nước hồ luôn ở 0°C',
          'Vì đáy hồ phủ hoàn toàn bằng nhựa tổng hợp',
        ],
        dapAnDung: 0,
        giaiThich:
          'Ion CO₃²⁻ và HCO₃⁻ từ đá vôi hòa tan có khả năng nhận H⁺, giữ pH hồ ổn định.',
      },
      {
        cauHoi: 'Nước tự nhiên chảy qua vùng đá vôi thường chứa nhiều ion nào gây "tính cứng tạm thời"?',
        dapAn: ['Na⁺ và K⁺', 'Ca²⁺ và Mg²⁺', 'Ag⁺ và Au³⁺', 'Cu²⁺ và Zn²⁺'],
        dapAnDung: 1,
        giaiThich:
          'Đá vôi và dolomit giải phóng ion Ca²⁺, Mg²⁺ cùng HCO₃⁻ vào nước ngầm và nước hồ.',
      },
      {
        cauHoi: 'Địa hình các ngọn núi đá vôi tách biệt nhô lên giữa mặt hồ rộng lớn thuộc dạng địa mạo nào?',
        dapAn: ['Địa hình cồn cát ven biển', 'Địa hình thung lũng Karst ngập nước', 'Địa hình miệng núi lửa', 'Địa hình băng hà'],
        dapAnDung: 1,
        giaiThich:
          'Đây là kết quả của quá trình bào mòn Karst tạo thung lũng phẳng rồi tích nước thành hồ.',
      },
    ],
  },

  // =========================================================================
  // CỤM 2: NINH BÌNH SINH THÁI (ĐA DẠNG SINH HỌC & BẢO TỒN)
  // =========================================================================
  {
    // TODO: kiểm tra lại
    id: '04',
    soThuTu: 4,
    cumId: 'cum-2',
    cum: 'Ninh Bình Sinh Thái (Đa dạng sinh học & Bảo tồn)',
    ten: 'Đầm Vân Long – Đất ngập nước nội địa',
    diaPhuong: 'Gia Viễn, Ninh Bình',
    anh: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg',
    moTaNgan:
      'Khu bảo tồn thiên nhiên đất ngập nước lớn nhất đồng bằng Bắc Bộ, nơi sinh sống của voọc mông trắng quý hiếm và thảm thực vật lọc nước tự nhiên.',
    kienThuc: {
      linhVuc: 'Sinh thái học & Chu trình dinh dưỡng',
      tomTat:
        'Đầm Vân Long hoạt động như một "lá phổi và bộ lọc sinh học". Rễ của các loài thực vật thủy sinh như rong đuôi chó, sen, súng hấp thụ nitrat (NO₃⁻) và photphat dư thừa trong nước, giúp nước đầm trong vắt đến tận đáy và nuôi dưỡng hệ động vật đặc hữu.',
      diemNhan: [
        'Mặt nước đầm phẳng lặng như gương nhờ được bao bọc bởi vòng cung núi đá vôi chắn gió.',
        'Thực vật thủy sinh cung cấp oxy hòa tan (DO) cho nước qua quá trình quang hợp.',
        'Là sinh cảnh trọng yếu bảo tồn loài Voọc mông trắng (Trachypithecus delacouri) đặc hữu của Việt Nam.',
      ],
      phuongTrinh: '6CO₂ + 6H₂O —(Ánh sáng, Diệp lục)→ C₆H₁₂O₆ + 6O₂↑',
      giaiThichPhuongTrinh:
        'Quang hợp của thực vật thủy sinh bổ sung oxy hòa tan trực tiếp vào nước đầm.',
    },
    video: {
      youtubeId: 'M7lc1UVf-VE', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 04
      tieuDe: 'Hệ sinh thái đất ngập nước và bộ lọc tự nhiên Đầm Vân Long',
      thoiLuong: '04:10',
    },
    cauHoi: [
      {
        cauHoi: 'Vai trò chính của thảm thực vật thủy sinh trong đầm Vân Long đối với chất lượng nước là gì?',
        dapAn: [
          'Làm tăng lượng kim loại nặng trong nước',
          'Hấp thụ chất dinh dưỡng dư thừa và giải phóng oxy hòa tan',
          'Ngăn ánh sáng mặt trời chiếu xuống vĩnh viễn',
          'Biến nước ngọt thành nước mặn',
        ],
        dapAnDung: 1,
        giaiThich:
          'Thực vật thủy sinh hấp thu NO₃⁻, PO₄³⁻ dư và tạo ra O₂ hòa tan nhờ quang hợp.',
      },
      {
        cauHoi: 'Loài linh trưởng đặc hữu quý hiếm nào được bảo tồn nghiêm ngặt tại khu bảo tồn Vân Long?',
        dapAn: ['Voọc mông trắng', 'Gấu trúc lớn', 'Chuột túi Kangaroo', 'Hươu cao cổ'],
        dapAnDung: 0,
        giaiThich:
          'Đầm Vân Long là nơi có quần thể Voọc mông trắng ngoài tự nhiên lớn nhất Việt Nam.',
      },
      {
        cauHoi: 'Chỉ số DO (Dissolved Oxygen) trong nước đầm dùng để đo đại lượng nào?',
        dapAn: ['Độ đục của bùn đáy', 'Hàm lượng oxy hòa tan trong nước', 'Nồng độ muối ăn NaCl', 'Độ cao mực nước'],
        dapAnDung: 1,
        giaiThich: 'DO là lượng oxy hòa tan trong nước, quyết định sự sống của cá và sinh vật thủy sinh.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '05',
    soThuTu: 5,
    cumId: 'cum-2',
    cum: 'Ninh Bình Sinh Thái (Đa dạng sinh học & Bảo tồn)',
    ten: 'Tam Cốc – Hang Múa: Quang học & Đỉnh Karst',
    diaPhuong: 'Ninh Hải, Hoa Lư, Ninh Bình',
    anh: '/src/assets/images/station_karst_cave_1795513152972.jpg',
    moTaNgan:
      'Sự giao thoa giữa ánh sáng tự nhiên, mặt nước sông Ngô Đồng và hệ thực vật chịu hạn đặc biệt trên đỉnh núi đá vôi.',
    kienThuc: {
      linhVuc: 'Vật lý quang học & Sinh học thích nghi',
      tomTat:
        'Trên mặt nước êm ả của Tam Cốc, ánh sáng mặt trời phản xạ gương tạo ảnh núi non sắc nét; khi đi vào cửa hang, tia sáng hắt lên trần vòm tạo hiệu ứng tán xạ lung linh. Trong khi đó, thực vật trên đỉnh Hang Múa có lá nhỏ, lớp cutin dày để giảm thoát hơi nước trên nền đá vôi khô hạn.',
      diemNhan: [
        'Phản xạ ánh sáng trên mặt nước yên tĩnh tuân theo định luật phản xạ (góc tới bằng góc phản xạ).',
        'Rêu và dương xỉ ở cửa hang thích nghi với cường độ ánh sáng yếu nhờ tăng hàm lượng diệp lục b.',
        'Thực vật đỉnh núi đá vôi thích nghi môi trường thiếu nước bằng rễ bám sâu vào khe nứt đá.',
      ],
      phuongTrinh: 'n₁ · sin(i) = n₂ · sin(r)  |  i = i′',
      giaiThichPhuongTrinh:
        'Định luật khúc xạ (Snell) khi ánh sáng truyền qua nước và định luật phản xạ trên mặt sông.',
    },
    video: {
      youtubeId: 'dQw4w9WgXcQ', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 05
      tieuDe: 'Hiện tượng quang học và thảm thực vật trên đỉnh núi đá vôi',
      thoiLuong: '03:30',
    },
    cauHoi: [
      {
        cauHoi: 'Vì sao mặt sông Ngô Đồng yên lặng lại soi bóng rõ rệt dãy núi đá vôi Tam Cốc?',
        dapAn: [
          'Do hiện tượng phản xạ gương trên bề mặt nước phẳng',
          'Do hiện tượng nhiễm điện do cọ xát',
          'Do lực hấp dẫn làm cong tia sáng',
          'Do nước sông phát ra ánh sáng huỳnh quang',
        ],
        dapAnDung: 0,
        giaiThich:
          'Mặt nước phẳng đóng vai trò như một gương phẳng tự nhiên, phản xạ đều các tia sáng từ vách núi.',
      },
      {
        cauHoi: 'Đặc điểm nào giúp cây mọc trên đỉnh núi đá vôi Hang Múa hạn chế mất nước vào mùa khô?',
        dapAn: [
          'Lá rất to, mỏng và không có lớp phủ',
          'Lá nhỏ, dày, có lớp sáp cutin bảo vệ bề mặt',
          'Không có rễ và trôi nổi hoàn toàn',
          'Chỉ quang hợp vào ban đêm không cần ánh sáng',
        ],
        dapAnDung: 1,
        giaiThich:
          'Lớp cutin dày và kích thước lá thu gọn giúp giảm diện tích thoát hơi nước qua khí khổng.',
      },
      {
        cauHoi: 'Khi tia sáng truyền xiên góc từ không khí vào nước sông, hiện tượng nào xảy ra tại mặt phân cách?',
        dapAn: [
          'Tia sáng bị bẻ gãy (khúc xạ) do vận tốc ánh sáng thay đổi',
          'Tia sáng dừng lại hoàn toàn',
          'Ánh sáng biến thành sóng âm',
          'Bước sóng ánh sáng tăng lên vô hạn',
        ],
        dapAnDung: 0,
        giaiThich:
          'Ánh sáng truyền qua hai môi trường có chiết suất khác nhau (không khí và nước) bị khúc xạ.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '06',
    soThuTu: 6,
    cumId: 'cum-2',
    cum: 'Ninh Bình Sinh Thái (Đa dạng sinh học & Bảo tồn)',
    ten: 'Vườn Quốc gia Cúc Phương',
    diaPhuong: 'Nho Quan, Ninh Bình',
    anh: '/src/assets/images/station_cucphuong_forest_1795513153287.jpg',
    moTaNgan:
      'Vườn quốc gia đầu tiên của Việt Nam — bảo tàng sống về đa dạng sinh học rừng mưa nhiệt đới trên núi đá vôi và cây cổ thụ nghìn năm.',
    kienThuc: {
      linhVuc: 'Sinh học bảo tồn & Cấu trúc rừng',
      tomTat:
        'Rừng nguyên sinh Cúc Phương phân hóa thành nhiều tầng tán rõ rệt (tầng vượt tán, tầng tán rừng, tầng dưới tán, tầng thảm tươi) nhằm tối ưu hóa việc thu nhận ánh sáng mặt trời. Các cây cổ thụ như Chò chỉ nghìn năm phát triển bộ rễ bạnh vè khổng lồ để đứng vững trên tầng đất mỏng phủ trên đá vôi.',
      diemNhan: [
        'Cấu trúc rừng 4–5 tầng giúp đa dạng hóa ổ sinh thái cho thực vật và động vật.',
        'Rễ bạnh vè mở rộng diện tích tiếp xúc, giữ vững thân cây cao 45–50m trước gió bão.',
        'Hệ vi sinh vật đất phân giải lá rụng, tái tạo mùn hữu cơ và khép kín chu trình cacbon – nitơ.',
      ],
      phuongTrinh: 'Chất hữu cơ (lá rụng) + O₂ —(Vi sinh vật)→ CO₂ + H₂O + Khoáng chất',
      giaiThichPhuongTrinh:
        'Quá trình khoáng hóa mùn rừng cung cấp dinh dưỡng liên tục cho cây cổ thụ.',
    },
    video: {
      youtubeId: 'M7lc1UVf-VE', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 06
      tieuDe: 'Cấu trúc tầng tán và đa dạng sinh học rừng nguyên sinh Cúc Phương',
      thoiLuong: '05:00',
    },
    cauHoi: [
      {
        cauHoi: 'Vì sao cây Chò chỉ nghìn năm ở Cúc Phương phát triển bộ rễ bạnh vè rất lớn trên mặt đất?',
        dapAn: [
          'Để tăng độ vững chắc khi tầng đất trên nền đá vôi khá mỏng',
          'Để cây có thể tự di chuyển sang vị trí khác',
          'Để dự trữ muối ăn từ nước biển',
          'Để phản xạ ánh sáng mặt trời xuống đất',
        ],
        dapAnDung: 0,
        giaiThich:
          'Rễ bạnh vè giúp phân tán trọng lực của thân cây khổng lồ trên nền đất rừng đá vôi nông.',
      },
      {
        cauHoi: 'Ý nghĩa sinh thái quan trọng nhất của sự phân tầng theo chiều thẳng đứng trong rừng Cúc Phương là gì?',
        dapAn: [
          'Giảm cạnh tranh và tận dụng tối đa nguồn ánh sáng, không gian sống',
          'Ngăn không cho mưa rơi xuống mặt đất',
          'Làm giảm số lượng loài sinh vật trong rừng',
          'Tăng tốc độ xói mòn đất đá',
        ],
        dapAnDung: 0,
        giaiThich:
          'Mỗi tầng cây thích nghi với cường độ ánh sáng khác nhau, giúp hệ sinh thái đạt năng suất sinh học cao.',
      },
      {
        cauHoi: 'Nhóm sinh vật nào đóng vai trò biến đổi lá cây rụng thành chất khoáng trả lại cho đất rừng?',
        dapAn: ['Sinh vật phân giải (nấm, vi khuẩn)', 'Động vật ăn thịt bậc cao', 'Cây ký sinh trên ngọn cây', 'Các loài chim di cư'],
        dapAnDung: 0,
        giaiThich:
          'Nấm và vi khuẩn hoại sinh phân hủy chất hữu cơ thành muối khoáng để rễ cây tái hấp thu.',
      },
    ],
  },

  // =========================================================================
  // CỤM 3: NAM ĐỊNH DI SẢN & BIỂN (LÀNG NGHỀ – VẬT LIỆU & BIỂN ĐẢO)
  // =========================================================================
  {
    // TODO: kiểm tra lại
    id: '07',
    soThuTu: 7,
    cumId: 'cum-3',
    cum: 'Nam Định Di Sản & Biển (Làng nghề – Vật liệu & Biển đảo)',
    ten: 'Làng đúc đồng Tống Xá',
    diaPhuong: 'Yên Xá, Ý Yên, Nam Định',
    anh: '/src/assets/images/station_tongxa_bronze_1795513153170.jpg',
    moTaNgan:
      'Tinh hoa luyện kim hơn 900 năm tuổi với công nghệ nấu chảy hợp kim đồng – thiếc ở nhiệt độ cao và khuôn đất sét chịu nhiệt.',
    kienThuc: {
      linhVuc: 'Khoa học vật liệu & Luyện kim',
      tomTat:
        'Nghệ nhân Tống Xá pha chế hợp kim đồng thanh (Bronze) từ đồng (Cu, nóng chảy 1085°C) và thiếc (Sn, nóng chảy 232°C). Việc pha thêm thiếc giúp hạ nhiệt độ nóng chảy của hỗn hợp, tăng độ chảy loãng để điền đầy chi tiết hoa văn tinh xảo, đồng thời tăng độ cứng và khả năng chống ăn mòn của sản phẩm.',
      diemNhan: [
        'Hợp kim đồng – thiếc có độ bền cơ học và độ vang âm thanh vượt trội so với đồng nguyên chất.',
        'Khuôn đúc trộn đất sét, trấu và giấy dó để tạo độ xốp thoáng khí khi rót đồng lỏng.',
        'Lớp gỉ đồng xanh tự nhiên (patina) giúp bảo vệ lõi kim loại bên trong khỏi bị ăn mòn sâu.',
      ],
      phuongTrinh: 'Cu (nóng chảy) + Sn (nóng chảy) → Hợp kim Đồng thanh (Cu–Sn)',
      giaiThichPhuongTrinh:
        'Quá trình phối trộn hợp kim ở 1000°C – 1150°C tối ưu hóa độ cứng và tính đúc.',
    },
    video: {
      youtubeId: 'dQw4w9WgXcQ', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 07
      tieuDe: 'Bí quyết luyện kim hợp kim đồng thanh tại làng nghề Tống Xá',
      thoiLuong: '04:30',
    },
    cauHoi: [
      {
        cauHoi: 'Vì sao nghệ nhân Tống Xá pha thêm thiếc (Sn) vào đồng (Cu) khi đúc tượng và chuông?',
        dapAn: [
          'Hạ nhiệt độ nóng chảy, tăng độ chảy loãng và tăng độ cứng hợp kim',
          'Để biến đồng thành kim loại nhẹ nổi trên mặt nước',
          'Để sản phẩm dễ bị gỉ sét nhanh hơn',
          'Để giảm hoàn toàn khối lượng riêng xuống bằng nhựa',
        ],
        dapAnDung: 0,
        giaiThich:
          'Hợp kim đồng – thiếc dễ điền đầy khuôn hơn, cứng hơn và tạo âm thanh vang xa hơn đồng nguyên chất.',
      },
      {
        cauHoi: 'Thành phần chính của hợp kim "đồng thanh" truyền thống gồm hai kim loại nào?',
        dapAn: ['Sắt (Fe) và Cacbon (C)', 'Đồng (Cu) và Thiếc (Sn)', 'Nhôm (Al) và Magie (Mg)', 'Vàng (Au) và Bạc (Ag)'],
        dapAnDung: 1,
        giaiThich: 'Đồng thanh (Bronze) chủ yếu là hợp kim giữa đồng (Cu) và thiếc (Sn).',
      },
      {
        cauHoi: 'Trong khuôn đúc đất sét truyền thống, người thợ trộn thêm vỏ trấu nhằm mục đích vật lý nào?',
        dapAn: [
          'Tạo khe hở thoát khí nóng, tránh rỗ khí trên bề mặt tượng đồng',
          'Làm khuôn chảy tan cùng với đồng lỏng',
          'Tạo màu xanh cho đồng sau khi nguội',
          'Tăng độ dẫn điện của đất sét',
        ],
        dapAnDung: 0,
        giaiThich:
          'Trấu cháy tạo các vi lỗ xốp giúp khí thoát ra ngoài khi rót kim loại nóng chảy, giữ bề mặt đúc mịn đẹp.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '08',
    soThuTu: 8,
    cumId: 'cum-3',
    cum: 'Nam Định Di Sản & Biển (Làng nghề – Vật liệu & Biển đảo)',
    ten: 'Làng sơn mài Cát Đằng',
    diaPhuong: 'Yên Tiến, Ý Yên, Nam Định',
    anh: '/src/assets/images/station_tongxa_bronze_1795513153170.jpg',
    moTaNgan:
      'Nghệ thuật chế tác vật liệu polyme tự nhiên từ nhựa cây sơn ta, khô cứng nhờ phản ứng trùng hợp xúc tác enzyme trong phòng ủ ẩm.',
    kienThuc: {
      linhVuc: 'Hóa học hữu cơ & Polyme tự nhiên',
      tomTat:
        'Khác với sơn công nghiệp khô nhờ bay hơi dung môi, nhựa sơn ta chứa hợp chất urushiol chỉ đóng rắn khi được ủ ở độ ẩm cao (75–85%). Enzyme laccase trong nhựa xúc tác phản ứng oxi hóa – trùng hợp với oxy không khí, tạo thành mạng lưới polyme không gian cực kỳ bền với nước và axit.',
      diemNhan: [
        'Sơn ta cần môi trường ẩm (tủ ủ) để enzyme laccase hoạt động hiệu quả.',
        'Màng sơn sau khi đóng rắn có độ bóng sâu, chống thấm và chịu mài mòn cao.',
        'Cốt vóc truyền thống dùng tre, gỗ kết hợp đất phù sa sông Hồng và vải màn.',
      ],
      phuongTrinh: 'n Urushiol + O₂ —(Enzyme Laccase, Độ ẩm 80%)→ Mạng polyme bền vững',
      giaiThichPhuongTrinh:
        'Phản ứng trùng hợp khâu mạch sinh học tạo lớp sơn mài bóng và kháng hóa chất.',
    },
    video: {
      youtubeId: 'M7lc1UVf-VE', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 08
      tieuDe: 'Hóa học polyme tự nhiên trong nghệ thuật sơn mài Cát Đằng',
      thoiLuong: '03:55',
    },
    cauHoi: [
      {
        cauHoi: 'Điều kiện môi trường đặc biệt nào giúp sơn mài truyền thống Cát Đằng khô và đóng rắn bền nhất?',
        dapAn: [
          'Phòng ủ có độ ẩm cao khoảng 75% – 85%',
          'Phơi trực tiếp dưới lò sấy 300°C',
          'Đặt trong môi trường chân không tuyệt đối',
          'Ngâm hoàn toàn trong axit mạnh',
        ],
        dapAnDung: 0,
        giaiThich:
          'Độ ẩm cao giúp enzyme laccase xúc tác phản ứng trùng hợp urushiol với oxy tạo màng polyme rắn chắc.',
      },
      {
        cauHoi: 'Quá trình nhựa sơn ta chuyển từ lỏng sang màng rắn không tan là loại phản ứng hóa học nào?',
        dapAn: ['Phản ứng trùng hợp khâu mạch', 'Phản ứng trung hòa axit – bazơ', 'Phản ứng nhiệt phân', 'Phản ứng điện phân'],
        dapAnDung: 0,
        giaiThich:
          'Các phân tử urushiol liên kết với nhau tạo thành mạng lưới polyme cao phân tử bền vững.',
      },
      {
        cauHoi: 'Yếu tố sinh học nào đóng vai trò chất xúc tác tự nhiên trong nhựa cây sơn?',
        dapAn: ['Enzyme laccase', 'Khí nitơ lỏng', 'Bột đá vôi', 'Tinh thể muối biển'],
        dapAnDung: 0,
        giaiThich: 'Enzyme laccase thúc đẩy quá trình oxi hóa trùng hợp ở nhiệt độ phòng.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '09',
    soThuTu: 9,
    cumId: 'cum-3',
    cum: 'Nam Định Di Sản & Biển (Làng nghề – Vật liệu & Biển đảo)',
    ten: 'Làng ươm tơ Cổ Chất',
    diaPhuong: 'Phương Định, Trực Ninh, Nam Định',
    anh: '/src/assets/images/station_cucphuong_forest_1795513153287.jpg',
    moTaNgan:
      'Khám phá cấu trúc protein tự nhiên của sợi tơ tằm bên dòng sông Ninh Cơ — loại sợi sinh học nhẹ, bền và thoáng khí bậc nhất.',
    kienThuc: {
      linhVuc: 'Hóa sinh học & Vật liệu sợi tự nhiên',
      tomTat:
        'Sợi tơ tằm cấu tạo từ hai loại protein tự nhiên: lõi fibroin bền chắc và lớp keo sericin bọc bên ngoài. Khi ươm tơ ở Cổ Chất, người thợ ngâm kén trong nước nóng khoảng 75–85°C để làm mềm lớp keo sericin, giúp kéo rút sợi tơ mảnh liên tục dài hàng trăm mét mà không làm biến tính lõi fibroin.',
      diemNhan: [
        'Sợi tơ tằm có bản chất là chuỗi polipeptit (protein) nên thân thiện với làn da và phân hủy sinh học.',
        'Mặt cắt tam giác của sợi fibroin giúp tán xạ ánh sáng tạo ánh óng ả tự nhiên.',
        'Kiểm soát nhiệt độ nước ươm tơ là bước kỹ thuật then chốt bảo toàn độ bền kéo của sợi.',
      ],
      phuongTrinh: 'n Amino axit —(Tổng hợp sinh học)→ Chuỗi Protein Fibroin + (n−1)H₂O',
      giaiThichPhuongTrinh:
        'Các mắt xích amino axit nối với nhau qua liên kết peptit tạo thành sợi tơ bền chắc.',
    },
    video: {
      youtubeId: 'dQw4w9WgXcQ', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 09
      tieuDe: 'Khoa học đằng sau sợi tơ tằm tại làng ươm tơ Cổ Chất',
      thoiLuong: '04:05',
    },
    cauHoi: [
      {
        cauHoi: 'Về mặt hóa học, sợi tơ tằm tự nhiên thuộc loại hợp chất cao phân tử nào?',
        dapAn: ['Protein (polipeptit)', 'Tinh bột (polisaccarit)', 'Nhựa PVC', 'Thủy tinh silicat'],
        dapAnDung: 0,
        giaiThich:
          'Sợi tơ tằm gồm protein fibroin ở lõi và protein sericin ở vỏ ngoài.',
      },
      {
        cauHoi: 'Trong quy trình ươm tơ Cổ Chất, việc nhúng kén vào nước nóng nhằm mục đích chính là gì?',
        dapAn: [
          'Làm mềm lớp keo sericin để dễ dàng tách và kéo sợi tơ liên tục',
          'Nhuộm màu đen cho sợi tơ ngay lập tức',
          'Biến sợi tơ thành sợi tổng hợp nilon',
          'Làm đông cứng hoàn toàn vỏ kén',
        ],
        dapAnDung: 0,
        giaiThich:
          'Nước nóng làm trương nở và hòa tan một phần keo sericin bao quanh sợi fibroin.',
      },
      {
        cauHoi: 'Đặc điểm hình học nào giúp lụa tơ tằm có độ óng ánh tự nhiên dưới ánh sáng?',
        dapAn: [
          'Mặt cắt sợi fibroin có dạng gần tam giác tán xạ ánh sáng như lăng kính nhỏ',
          'Trong sợi tơ có chứa bột thủy tinh',
          'Sợi tơ phát quang tự nhiên trong bóng tối',
          'Lụa được phủ một lớp kim loại bạc',
        ],
        dapAnDung: 0,
        giaiThich:
          'Cấu trúc lăng kính tam giác của sợi tơ phản xạ và tán xạ ánh sáng ở nhiều góc độ.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '10',
    soThuTu: 10,
    cumId: 'cum-3',
    cum: 'Nam Định Di Sản & Biển (Làng nghề – Vật liệu & Biển đảo)',
    ten: 'Cánh đồng muối Bạch Long',
    diaPhuong: 'Giao Thủy – Hải Hậu, Nam Định',
    anh: '/src/assets/images/station_xuanthuy_salt_1795513154146.jpg',
    moTaNgan:
      'Nghề làm muối phơi cát độc đáo sử dụng bức xạ Mặt Trời và nguyên lý kết tinh phân đoạn để thu nhận hạt muối trắng tinh khiết.',
    kienThuc: {
      linhVuc: 'Hóa lý & Năng lượng Mặt Trời',
      tomTat:
        'Diêm dân Bạch Long dùng cát mịn thấm nước biển rồi phơi nắng để tăng diện tích bề mặt bay hơi. Nước chạt (dung dịch NaCl bão hòa nồng độ cao) được dẫn vào ô kết tinh. Khi nước bay hơi đạt ngưỡng quá bão hòa, ion Na⁺ và Cl⁻ sắp xếp thành mạng tinh thể lập phương tạo hạt muối rắn.',
      diemNhan: [
        'Phơi cát làm tăng diện tích tiếp xúc với nắng gió, đẩy nhanh tốc độ bay hơi của nước.',
        'Độ tan của NaCl ít thay đổi theo nhiệt độ nên kết tinh chủ yếu bằng phương pháp làm bay hơi dung môi.',
        'Kiểm soát nồng độ nước chạt (khoảng 25°Bé) giúp tách muối NaCl sạch khỏi tạp chất canxi và magie.',
      ],
      phuongTrinh: 'Na⁺ (dd) + Cl⁻ (dd) —(Bay hơi nước dưới bức xạ Mặt Trời)→ NaCl (tinh thể)',
      giaiThichPhuongTrinh:
        'Quá trình kết tinh muối ăn từ dung dịch nước biển bão hòa nhờ năng lượng mặt trời.',
    },
    video: {
      youtubeId: 'M7lc1UVf-VE', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 10
      tieuDe: 'Cơ chế bay hơi và kết tinh muối trên cánh đồng Bạch Long',
      thoiLuong: '03:40',
    },
    cauHoi: [
      {
        cauHoi: 'Vì sao diêm dân Nam Định rải cát mịn lên sân phơi rồi tưới nước biển trước khi lọc lấy nước chạt?',
        dapAn: [
          'Tăng diện tích bề mặt bay hơi dưới ánh nắng và gió, giúp nước biển nhanh cô đặc',
          'Để cát hòa tan hoàn toàn vào muối ăn',
          'Để làm lạnh nước biển xuống 0°C',
          'Để biến NaCl thành đường mía',
        ],
        dapAnDung: 0,
        giaiThich:
          'Màng nước mỏng bám trên hàng triệu hạt cát giúp tốc độ bay hơi nhanh gấp nhiều lần phơi ao sâu.',
      },
      {
        cauHoi: 'Tinh thể muối ăn (NaCl) tinh khiết có dạng hình học đặc trưng nào?',
        dapAn: ['Hình lập phương', 'Hình cầu rỗng', 'Hình trụ xoắn ốc', 'Hình ngũ giác phẳng'],
        dapAnDung: 0,
        giaiThich:
          'Mạng tinh thể ion của NaCl gồm các ion Na⁺ và Cl⁻ sắp xếp luân phiên theo cấu trúc lập phương tâm diện.',
      },
      {
        cauHoi: 'Quá trình chuyển trạng thái vật chất nào xảy ra để tách muối NaCl khỏi nước biển trên ruộng muối?',
        dapAn: [
          'Bay hơi dung môi (nước) và kết tinh chất tan (NaCl)',
          'Thăng hoa trực tiếp từ rắn sang khí',
          'Đông đặc toàn bộ nước biển thành băng',
          'Phản ứng cháy tỏa nhiệt',
        ],
        dapAnDung: 0,
        giaiThich:
          'Nhiệt năng từ Mặt Trời làm nước bay hơi, khiến nồng độ muối vượt ngưỡng bão hòa và kết tinh.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '11',
    soThuTu: 11,
    cumId: 'cum-3',
    cum: 'Nam Định Di Sản & Biển (Làng nghề – Vật liệu & Biển đảo)',
    ten: 'Vườn Quốc gia Xuân Thủy',
    diaPhuong: 'Giao Thủy, Nam Định',
    anh: '/src/assets/images/station_xuanthuy_salt_1795513154146.jpg',
    moTaNgan:
      'Khu Ramsar đầu tiên của Đông Nam Á — thành lũy xanh rừng ngập mặn cửa sông Hồng với cơ chế lọc mặn và rễ thở kỳ diệu.',
    kienThuc: {
      linhVuc: 'Sinh thái cửa sông & Biến đổi khí hậu',
      tomTat:
        'Tại vùng bãi triều cửa Ba Lạt, cây sú, vẹt, trang, bần sống trong bùn lầy ngập mặn thiếu oxy và nồng độ muối cao. Chúng tiến hóa hệ rễ thở mọc ngược lên khỏi mặt bùn để lấy oxy, cùng màng tế bào rễ có khả năng siêu lọc ngăn tới 90% ion muối Na⁺, đồng thời bài tiết muối dư qua tuyến muối trên lá.',
      diemNhan: [
        'Rừng ngập mặn đóng vai trò "bức tường xanh" giảm 50–70% năng lượng sóng bão bảo vệ đê biển.',
        'Khả năng lưu trữ "Cacbon xanh" (Blue Carbon) của đất rừng ngập mặn cao gấp nhiều lần rừng trên cạn.',
        'Là trạm dừng chân quan trọng của hàng chục nghìn cá thể chim di cư quốc tế, trong đó có Cò thìa mặt đen.',
      ],
      phuongTrinh: 'Nước lợ (NaCl cao) —(Màng rễ siêu lọc)→ Nước ngọt cung cấp cho thân lá',
      giaiThichPhuongTrinh:
        'Cơ chế thẩm thấu chọn lọc giúp thực vật ngập mặn sinh trưởng tốt trong môi trường nước lợ mặn.',
    },
    video: {
      youtubeId: 'dQw4w9WgXcQ', // TODO: kiểm tra lại — Thay bằng video thực tế của Trạm 11
      tieuDe: 'Cơ chế thích nghi kỳ diệu của rừng ngập mặn Xuân Thủy',
      thoiLuong: '04:45',
    },
    cauHoi: [
      {
        cauHoi: 'Cây bần, cây mắm ở rừng ngập mặn Xuân Thủy mọc nhiều rễ chĩa ngược lên mặt bùn nhằm mục đích gì?',
        dapAn: [
          'Hô hấp lấy khí oxy trong môi trường bùn lầy ngập nước thiếu khí',
          'Để hấp thụ ánh sáng thay cho lá',
          'Để xua đuổi các loài chim di cư',
          'Để hút khí nitơ chuyển thành muối ăn',
        ],
        dapAnDung: 0,
        giaiThich:
          'Bùn ngập mặn rất nghèo oxy; rễ thở (pneumatophores) vươn lên không khí giúp rễ trao đổi khí.',
      },
      {
        cauHoi: 'Thuật ngữ "Cacbon xanh" (Blue Carbon) gắn với Vườn Quốc gia Xuân Thủy chỉ lượng cacbon được lưu giữ ở đâu?',
        dapAn: [
          'Trong sinh khối và lớp trầm tích bùn của hệ sinh thái rừng ngập mặn ven biển',
          'Trong khí quyển tầng bình lưu',
          'Trong các mỏ than đá dưới lòng đất sâu',
          'Trong lõi kim loại của Trái Đất',
        ],
        dapAnDung: 0,
        giaiThich:
          'Rừng ngập mặn hấp thụ CO₂ rất nhanh và giữ cacbon bền vững trong lớp bùn ngập nước thiếu oxy.',
      },
      {
        cauHoi: 'Vai trò vật lý quan trọng của dải rừng ngập mặn ven biển đối với cộng đồng dân cư là gì?',
        dapAn: [
          'Tiêu giảm năng lượng sóng biển, chống xói lở bờ và bảo vệ đê điều',
          'Làm tăng chiều cao sóng thần',
          'Ngăn hoàn toàn dòng chảy sông Hồng ra biển',
          'Làm tăng độ mặn của nước giếng khoan',
        ],
        dapAnDung: 0,
        giaiThich:
          'Hệ rễ chằng chịt của cây ngập mặn tạo ma sát thủy lực lớn, làm suy yếu sóng và giữ phù sa bồi tụ.',
      },
    ],
  },
  {
    // TODO: kiểm tra lại
    id: '12',
    soThuTu: 12,
    cumId: 'cum-3',
    cum: 'Nam Định Di Sản & Biển (Làng nghề – Vật liệu & Biển đảo)',
    ten: 'Bảo tàng Tri thức Xanh & Kinh tế tuần hoàn',
    diaPhuong: 'Châu thổ Sông Hồng (Trạm Tổng kết)',
    anh: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg',
    moTaNgan:
      'Trạm đích kết nối toàn bộ hành trình Địa chất – Sinh thái – Vật liệu bản địa hướng tới phát triển bền vững và du lịch thông minh 4.0.',
    kienThuc: {
      linhVuc: 'Khoa học bền vững & STEM 4.0',
      tomTat:
        '11 trạm vừa đi qua cho thấy thiên nhiên và tri thức dân gian luôn vận hành theo những quy luật khoa học chặt chẽ: từ cân bằng hóa học đá vôi, bộ lọc sinh học đầm hồ, vật liệu polyme tự nhiên cho đến năng lượng mặt trời kết tinh muối và rừng ngập mặn hấp thụ cacbon. Số hóa di sản bằng mã QR và dữ liệu mở giúp thế hệ trẻ bảo tồn di sản bền vững.',
      diemNhan: [
        'Kinh tế tuần hoàn biến phụ phẩm nông nghiệp – làng nghề thành tài nguyên mới.',
        'Công nghệ số (QR, bản đồ tương tác, bảo tàng ảo) giảm rác thải in ấn tại điểm du lịch.',
        'Mỗi du khách nắm vững tri thức khoa học sẽ trở thành một Đại sứ bảo vệ di sản.',
      ],
      phuongTrinh: 'Di sản (Tài nguyên) + Tri thức STEM + Công nghệ 4.0 → Phát triển Bền vững',
      giaiThichPhuongTrinh:
        'Công thức kết nối giữa bảo tồn bản sắc địa phương và đổi mới sáng tạo khoa học kỹ thuật.',
    },
    video: {
      youtubeId: 'M7lc1UVf-VE', // TODO: kiểm tra lại — Thay bằng video tổng kết của Trạm 12
      tieuDe: 'Tổng kết hành trình Hộ chiếu Khoa học 4.0 & Tương lai xanh',
      thoiLuong: '04:00',
    },
    cauHoi: [
      {
        cauHoi: 'Mô hình "Bảo tàng Khoa học Số" sử dụng mã QR tại các điểm di sản mang lại lợi ích môi trường nào rõ rệt nhất?',
        dapAn: [
          'Giảm lượng tờ rơi giấy in ấn dùng một lần và tăng tương tác tri thức mọi lúc',
          'Tăng lượng rác thải nhựa tại khu bảo tồn',
          'Thay thế hoàn toàn cây xanh bằng màn hình điện tử',
          'Làm tăng lượng khí thải CO₂ tại chỗ',
        ],
        dapAnDung: 0,
        giaiThich:
          'Số hóa thông tin qua QR giúp du khách tra cứu trực tiếp trên điện thoại, hạn chế rác thải giấy in.',
      },
      {
        cauHoi: 'Nguyên tắc cốt lõi của "Kinh tế tuần hoàn" được gợi mở từ các làng nghề và hệ sinh thái là gì?',
        dapAn: [
          'Tái sử dụng, tái chế và khép kín vòng đời vật chất, giảm thiểu rác thải ra môi trường',
          'Khai thác tài nguyên tối đa rồi thải bỏ một chiều',
          'Chỉ dùng vật liệu nhựa khó phân hủy',
          'Không cần xử lý nước thải làng nghề',
        ],
        dapAnDung: 0,
        giaiThich:
          'Kinh tế tuần hoàn mô phỏng chu trình tự nhiên: chất thải của khâu này trở thành đầu vào của khâu khác.',
      },
      {
        cauHoi: 'Điểm chung khoa học xuyên suốt 3 cụm trạm (Địa chất – Sinh thái – Làng nghề & Biển) là gì?',
        dapAn: [
          'Mọi hiện tượng di sản đều gắn với quy luật Lý – Hóa – Sinh và cân bằng tự nhiên',
          'Chỉ có ý nghĩa truyền thuyết, không liên quan đến khoa học thực nghiệm',
          'Các hệ sinh thái hoàn toàn tách biệt, không tác động lẫn nhau',
          'Chỉ có thể nghiên cứu bằng kính thiên văn',
        ],
        dapAnDung: 0,
        giaiThich:
          'Địa chất đá vôi nuôi dưỡng hệ sinh thái đặc hữu và cung cấp nguyên liệu cho đời sống – làng nghề bền vững.',
      },
    ],
  },
];

export interface AboutPageData {
  tieuDe: string;
  phuDe: string;
  anhBia: string;
  noiDungHtml: string;
  status: 'draft' | 'published';
}

export interface NewsPost {
  id: string;
  tieuDe: string;
  tomTat: string;
  danhMuc: string;
  tacGia: string;
  ngayDang: string;
  anhBia: string;
  noiDungHtml: string;
  status: 'draft' | 'published';
  visible: boolean;
}

export const DEFAULT_ABOUT_PAGE: AboutPageData = {
  tieuDe: 'Giới thiệu Dự án Bảo Tàng Khoa Học Số 4.0',
  phuDe: 'Kết nối di sản thiên nhiên – văn hóa châu thổ sông Hồng với giáo dục STEM hiện đại',
  anhBia: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg',
  status: 'published',
  noiDungHtml: `
    <h2>1. Sứ mệnh của Hộ Chiếu Du Lịch Khoa Học 4.0</h2>
    <p><strong>Hộ Chiếu Du Lịch Khoa Học 4.0 – Bảo Tàng Khoa Học Số: Di Sản &amp; Tri Thức</strong> là dự án giáo dục STEM liên môn kết hợp công nghệ mã QR và trải nghiệm thực địa, giúp học sinh và du khách khám phá các quy luật Địa chất, Hóa học, Vật lý và Sinh thái ẩn sau 12 miền di sản vùng Hà Nam – Ninh Bình – Nam Định.</p>
    <h2>2. Cấu trúc 3 cụm hành trình tri thức</h2>
    <table>
      <thead>
        <tr>
          <th>Cụm di sản</th>
          <th>Trọng tâm khoa học</th>
          <th>Các trạm tiêu biểu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Cụm 01 · Hà Nam &amp; Ninh Bình</strong></td>
          <td>Địa chất trầm tích, phản ứng hòa tan Karst &amp; cân bằng pH</td>
          <td>Núi Ngăm (01), Tràng An (02), Tam Chúc (03)</td>
        </tr>
        <tr>
          <td><strong>Cụm 02 · Ninh Bình Sinh Thái</strong></td>
          <td>Đa dạng sinh học đất ngập nước, quang học &amp; tầng tán rừng</td>
          <td>Đầm Vân Long (04), Tam Cốc – Hang Múa (05), Cúc Phương (06)</td>
        </tr>
        <tr>
          <td><strong>Cụm 03 · Nam Định Di Sản &amp; Biển</strong></td>
          <td>Luyện kim đồng thanh, polyme sơn mài, kết tinh muối &amp; rừng ngập mặn</td>
          <td>Tống Xá (07), Cát Đằng (08), Cổ Chất (09), Bạch Long (10), Xuân Thủy (11), Trạm Tổng kết (12)</td>
        </tr>
      </tbody>
    </table>
    <h2>3. Cách trải nghiệm Hộ chiếu số</h2>
    <ul>
      <li><strong>Bước 1:</strong> Quét mã QR đặt tại điểm di sản hoặc mở trực tiếp trạm trên bản đồ tương tác.</li>
      <li><strong>Bước 2:</strong> Đọc thẻ kiến thức khoa học, quan sát phương trình hóa học/quy luật tự nhiên và xem video tư liệu thực tế.</li>
      <li><strong>Bước 3:</strong> Hoàn thành thử thách trắc nghiệm đạt từ <strong>60% trở lên</strong> để nhận con dấu xác nhận và tích lũy danh hiệu <em>Nhà thám hiểm</em>, <em>Nhà khoa học trẻ</em> và <em>Đại sứ di sản</em>.</li>
    </ul>
  `.trim(),
};

export const DEFAULT_NEWS_POSTS: NewsPost[] = [
  {
    id: 'tin-01',
    tieuDe: 'Ra mắt mô hình Hộ Chiếu Du Lịch Khoa Học 4.0 kết nối 12 trạm di sản STEM',
    tomTat:
      'Dự án tích hợp mã QR tại thực địa giúp học sinh vừa tham quan di sản Hà Nam – Ninh Bình – Nam Định, vừa giải mã kiến thức Lý – Hóa – Sinh trực quan trên điện thoại.',
    danhMuc: 'Hoạt động dự án',
    tacGia: 'Nhóm Nghiên Cứu STEM',
    ngayDang: '2026-11-20',
    anhBia: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg',
    status: 'published',
    visible: true,
    noiDungHtml: `
      <p>Với định hướng đưa giáo dục STEM gắn liền với bảo tồn di sản địa phương, <strong>Bảo Tàng Khoa Học Số: Di Sản &amp; Tri Thức</strong> chính thức hoàn thiện phiên bản hộ chiếu điện tử 12 trạm.</p>
      <h3>Điểm mới nổi bật</h3>
      <ul>
        <li>Truy cập tức thì qua mã QR riêng cho từng trạm từ <code>01</code> đến <code>12</code>.</li>
        <li>Mỗi trạm gồm tóm tắt khoa học, phương trình đặc trưng, video tư liệu và thử thách đóng dấu tương tác.</li>
        <li>Hệ thống lưu dấu ấn cá nhân và trao danh hiệu theo từng cột mốc chinh phục.</li>
      </ul>
    `.trim(),
  },
  {
    id: 'tin-02',
    tieuDe: 'Giải mã hóa học tạo hang động Karst tại Quần thể Danh thắng Tràng An',
    tomTat:
      'Tìm hiểu phản ứng thuận nghịch giữa canxi cacbonat (CaCO₃) và nước mưa chứa CO₂ kiến tạo nên hệ thống hang xuyên thủy và thạch nhũ kỳ vĩ.',
    danhMuc: 'Khoa học di sản',
    tacGia: 'Ban Chuyên Môn Địa – Hóa',
    ngayDang: '2026-11-18',
    anhBia: '/src/assets/images/station_karst_cave_1795513152972.jpg',
    status: 'published',
    visible: true,
    noiDungHtml: `
      <p>Hệ thống núi đá vôi Tràng An là phòng thí nghiệm tự nhiên khổng lồ về phản ứng hòa tan và kết tủa khoáng vật cacbonat kéo dài hàng triệu năm.</p>
      <p>Khi nước mưa thấm qua lớp đất phủ giàu CO₂, quá trình hòa tan diễn ra theo phương trình: <strong>CaCO₃ + H₂O + CO₂ ⇌ Ca(HCO₃)₂</strong>. Khi giọt nước nhỏ từ trần hang, CO₂ thoát ra giúp tinh thể CaCO₃ kết tủa trở lại tạo thành măng đá và nhũ đá.</p>
    `.trim(),
  },
  {
    id: 'tin-03',
    tieuDe: 'Rừng ngập mặn Xuân Thủy – “Lá chắn xanh” và kho lưu trữ Cacbon xanh ven biển',
    tomTat:
      'Khám phá cơ chế rễ thở và màng siêu lọc muối giúp cây sú, vẹt, bần đứng vững trước sóng biển và bảo vệ hệ sinh thái cửa sông Hồng.',
    danhMuc: 'Sinh thái & Môi trường',
    tacGia: 'Ban Chuyên Môn Sinh thái',
    ngayDang: '2026-11-15',
    anhBia: '/src/assets/images/station_xuanthuy_salt_1795513154146.jpg',
    status: 'published',
    visible: true,
    noiDungHtml: `
      <p>Tại Vườn Quốc gia Xuân Thủy (Nam Định), thảm thực vật ngập mặn đóng vai trò lá chắn tự nhiên giảm năng lượng sóng bão và giữ phù sa bồi tụ.</p>
      <p>Bên cạnh khả năng lọc tới 90% ion Na⁺ qua màng rễ, lớp bùn ngập nước thiếu oxy tại đây còn lưu giữ lượng lớn <em>Blue Carbon</em> (Cacbon xanh), góp phần giảm nhẹ biến đổi khí hậu toàn cầu.</p>
    `.trim(),
  },
];

