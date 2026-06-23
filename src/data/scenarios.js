// ─────────────────────────────────────────────────────────────────────────
// Grounded in the True Shop · Central World field research (Assignment 1
// personas / journeys / pain points). Two connected concepts share this data:
//
//   • TRUE QUEUE   — customer books a queue from home in the True App, is told
//                    what to bring, and (if they share their True number) their
//                    profile is "pierced" into the queue so staff are ready.
//   • THE WELCOMER — staff greet + diagnose on an iPad the moment the customer
//                    arrives, the system narrows 40+ promotions down to the
//                    right offer, and the data is handed off to Service Staff.
//
// Customer data here is MOCK — designed so it can be wired to True's real
// systems (CRM Lite / billing / usage) with zero structural change.
// ─────────────────────────────────────────────────────────────────────────

// ── Personas (composite, from the field research) ─────────────────────────
export const PERSONAS = [
  {
    id: 'somchai',
    emoji: '👴',
    name: 'ลุงสมชาย',
    tagline: 'ลูกค้าสูงวัย ไม่ถนัดดิจิทัล',
    blurb: 'อยากคุยกับ “คน” ไม่ใช่ถูกชี้ไปกดตู้ — อ่อนไหวเรื่องราคา สงสัยว่าทำไมบิลแพงขึ้น',
    accent: '#b45309',
  },
  {
    id: 'nut',
    emoji: '💼',
    name: 'พี่นัท',
    tagline: 'พนักงานออฟฟิศ พักเที่ยงสั้น',
    blurb: 'เวลามีค่า เทียบ AIS ทันที — อยากให้จบในรอบเดียว ไม่อยากเสียเวลารอคิว',
    accent: '#1d4ed8',
  },
  {
    id: 'mark',
    emoji: '🎒',
    name: 'Mark',
    tagline: 'นักท่องเที่ยวต่างชาติ (สุดสัปดาห์)',
    blurb: 'อ่านไทยไม่ออก อยากได้ซิม/ดาต้าใช้ทันที เข้าใจชัดว่าจ่ายค่าอะไร',
    accent: '#0891b2',
  },
  {
    id: 'ae',
    emoji: '😤',
    name: 'คุณเอ',
    tagline: 'ลูกค้ากลุ่มเสี่ยงยกเลิก / ย้ายค่าย',
    blurb: 'ตั้งใจมายกเลิก/ย้ายค่าย หมดความอดทน — จะอยู่ต่อก็ต่อเมื่อเห็นข้อเสนอที่คุ้มจริง',
    accent: '#dc2626',
  },
]

export function getPersona(id) {
  return PERSONAS.find((p) => p.id === id) || null
}

// ── True Queue: services a customer can book from home ────────────────────
// Each maps to the "เลือกบริการ → บอกสิ่งที่ต้องเตรียม → ผูกเบอร์ → จองคิว" flow.
export const QUEUE_SERVICES = [
  {
    id: 'package',
    icon: 'signal',
    title: 'เปลี่ยน / ต่อแพ็กเกจ',
    sub: 'ปรึกษาแพ็กเกจ มือถือ/เน็ตบ้าน หรือต่อสัญญา',
    counter: 'เคาน์เตอร์ขาย / ปรึกษา',
    estMin: 12,
    personaId: 'nut',
    docs: [
      { icon: 'idcard', label: 'บัตรประชาชน', required: true },
      { icon: 'smartphone', label: 'เบอร์ที่ต้องการเปลี่ยนแพ็กเกจ', required: true },
      { icon: 'creditcard', label: 'บัตรเครดิตที่ร่วมรายการ (ถ้าผ่อน 0%)', required: false },
    ],
  },
  {
    id: 'device',
    icon: 'smartphone',
    title: 'ซื้อ / ผ่อนเครื่องใหม่',
    sub: 'เลือกเครื่อง ผ่อน 0% หรือเทิร์นเครื่องเก่า',
    counter: 'เคาน์เตอร์ขายเครื่อง (ITF)',
    estMin: 18,
    personaId: 'nut',
    docs: [
      { icon: 'idcard', label: 'บัตรประชาชน', required: true },
      { icon: 'creditcard', label: 'บัตรเครดิตที่ร่วมรายการ (สำหรับผ่อน 0%)', required: true },
      { icon: 'package', label: 'เครื่องเก่า + กล่อง (ถ้าจะเทิร์น)', required: false },
      { icon: 'file', label: 'สลิปเงินเดือน (เฉพาะบางโปรผ่อน)', required: false },
    ],
  },
  {
    id: 'new-sim',
    icon: 'globe',
    title: 'เปิดเบอร์ใหม่ / ซิมนักท่องเที่ยว',
    sub: 'Open a new number · Tourist SIM',
    counter: 'เคาน์เตอร์เปิดเบอร์',
    estMin: 15,
    personaId: 'mark',
    english: 'New SIM / Tourist SIM — bring your passport',
    docs: [
      { icon: 'idcard', label: 'บัตรประชาชน / Passport', required: true },
      { icon: 'scanface', label: 'สแกนใบหน้า (face-scan ที่ร้าน)', required: true },
    ],
  },
  {
    id: 'bill',
    icon: 'receipt',
    title: 'จ่ายบิล / สอบถามค่าบริการ',
    sub: 'ชำระเงิน หรือสอบถามว่าทำไมบิลแพงขึ้น',
    counter: 'ช่องด่วน (Fast Lane)',
    estMin: 5,
    personaId: 'somchai',
    fastLane: true,
    docs: [
      { icon: 'idcard', label: 'บัตรประชาชน', required: true },
      { icon: 'receipt', label: 'เลขที่ใบแจ้งหนี้ / เบอร์ที่จะชำระ', required: false },
    ],
  },
  {
    id: 'retention',
    icon: 'repeat',
    title: 'ยกเลิก / ย้ายค่าย',
    sub: 'ยกเลิกบริการ หรือย้ายค่าย (port out)',
    counter: 'แผนก Retention',
    estMin: 20,
    personaId: 'ae',
    docs: [
      { icon: 'idcard', label: 'บัตรประชาชนเจ้าของเบอร์', required: true },
      { icon: 'banknote', label: 'เคลียร์ยอดค้างชำระ (ถ้ามี)', required: true },
      { icon: 'file', label: 'เอกสารยืนยันตัวตน (กรณีจดทะเบียนแทน)', required: false },
    ],
  },
  {
    id: 'signal',
    icon: 'wifi',
    title: 'สัญญาณ / เน็ตมีปัญหา',
    sub: 'แจ้งปัญหาสัญญาณมือถือ หรือเน็ตบ้าน',
    counter: 'เคาน์เตอร์เทคนิค / After-sale',
    estMin: 10,
    personaId: 'somchai',
    docs: [
      { icon: 'idcard', label: 'บัตรประชาชน / เบอร์ที่มีปัญหา', required: true },
      { icon: 'home', label: 'ที่อยู่ติดตั้ง (กรณีเน็ตบ้าน)', required: false },
    ],
  },
]

export function getQueueService(id) {
  return QUEUE_SERVICES.find((s) => s.id === id) || null
}

// What the True App can pre-fill once the customer shares their True number.
// This is the data that gets "pierced" into the queue ticket.
export const QUEUE_PROFILE = {
  package: {
    name: 'คุณนัท วิไลพร',
    phone: '089-xxx-1188',
    plan: 'True 5G 399 (เน็ต 30GB)',
    insight: 'ใช้ดาต้าเกินแพ็กเกจ 5 เดือนติด — น่าจะมาปรึกษาอัปแพ็กเกจ',
  },
  device: {
    name: 'คุณนัท วิไลพร',
    phone: '089-xxx-1188',
    plan: 'True 5G 399',
    insight: 'ลูกค้าเดิม 2 ปี ประวัติชำระดี — มีสิทธิ์ผ่อน 0% 10 เดือน',
  },
  retention: {
    name: 'คุณเอ (เจ้าของเบอร์)',
    phone: '062-xxx-4420',
    plan: 'True 5G Together 599 + เน็ตบ้าน',
    insight: 'แจ้งเหตุผล: ย้ายบ้าน + มีเบอร์สำรอง — เคสเสี่ยง churn สูง',
  },
  bill: {
    name: 'คุณสมชาย ภักดีพงษ์',
    phone: '081-xxx-3210',
    plan: 'True 5G Together 599',
    insight: 'บิลเดือนนี้ +฿300 — ส่วนลดโปรฯ 12 เดือนเพิ่งหมด',
  },
  signal: {
    name: 'คุณสมชาย ภักดีพงษ์',
    phone: '081-xxx-3210',
    plan: 'True Online 1Gbps + True Vision',
    insight: 'แจ้งเน็ตบ้านช้าช่วงเย็น 3 วันติด',
  },
  'new-sim': null, // tourist — no existing True profile to pull
}

// ── The Welcomer: staff-led in-shop scenarios ─────────────────────────────
// Kept intentionally rich so the iPad flow reads as a real product.
export const WELCOMER_SCENARIOS = [
  {
    id: 'bill-dispute',
    personaId: 'somchai',
    title: 'ลุงสมชาย — บิลแพงขึ้น (โปรฯ หมด)',
    tag: 'เคสอารมณ์ร้อน · กลุ่มเปราะบาง',
    accent: '#ec2127',
    walkIn: {
      emoji: '😟',
      mood: 'งุนงง + หงุดหงิด',
      headline: 'ลูกค้าสูงวัยเดินเข้ามาถือใบแจ้งหนี้ มองหาพนักงาน',
      quote: 'บิลเดือนนี้ทำไมแพงขึ้นตั้งเยอะ! เดือนก่อนไม่เห็นเป็นแบบนี้',
    },
    customer: {
      name: 'คุณสมชาย ภักดีพงษ์',
      phone: '081-654-3210',
      plan: 'True 5G Together 599',
      tenure: '4 ปี 3 เดือน',
      arpu: '฿599 → ฿899 (เดือนนี้)',
      segment: 'ลูกค้าภักดี · ใช้ทีวี + เน็ตบ้าน',
      autopay: 'หักบัตรอัตโนมัติ • ไม่เคยค้างชำระ',
      insights: [
        'ลูกค้าภักดี 4 ปี — ไม่เคยค้างชำระ',
        'บิลเดือนนี้สูงผิดปกติ +฿300',
        'ส่วนลดโปรโมชัน 12 เดือนเพิ่งหมดอายุรอบบิลนี้',
      ],
      history: [
        { date: 'ก.พ. 2565', text: 'สมัครแพ็กเกจ 599 + ส่วนลด 12 เดือน' },
        { date: 'ม.ค. 2569', text: 'ส่วนลดโปรโมชันสิ้นสุด → กลับเป็นราคาเต็ม' },
      ],
    },
    diagnosis: [
      {
        id: 'reason',
        icon: 'target',
        q: 'ลูกค้ามาเรื่องอะไร?',
        captureLabel: 'เรื่องที่มา',
        options: [
          {
            value: 'bill',
            label: 'ค่าบริการ / บิลผิดปกติ',
            suggests: [
              { kind: 'do', text: 'เปิดบิลย้อนหลัง 3 เดือนในแท็บเล็ตให้ลูกค้าดูพร้อมกัน' },
            ],
          },
          { value: 'signal', label: 'สัญญาณ / เน็ตช้า' },
          { value: 'package', label: 'ปรึกษา / เปลี่ยนแพ็กเกจ' },
          { value: 'device', label: 'อุปกรณ์ / ซิม' },
        ],
      },
      {
        id: 'mood',
        icon: 'thermometer',
        q: 'ประเมินอารมณ์ลูกค้า',
        captureLabel: 'อารมณ์',
        options: [
          {
            value: 'hot',
            label: 'หัวร้อน / หงุดหงิด',
            flag: 'priority',
            suggests: [
              { kind: 'say', text: '"ผมเข้าใจเลยครับ เดี๋ยวผมช่วยเช็กให้ทันทีนะครับ" — รับฟังก่อน อย่าเพิ่งแก้' },
              { kind: 'insight', text: 'ตั้งค่าคิวเป็น "ด่วน/ดูแลพิเศษ" — ส่งสัญญาณให้ Service เตรียมรับ' },
            ],
          },
          { value: 'neutral', label: 'ปกติ' },
          { value: 'good', label: 'อารมณ์ดี' },
        ],
      },
      {
        id: 'detail',
        icon: 'search',
        q: 'ระบบพบสาเหตุ — ยืนยันกับลูกค้า',
        captureLabel: 'สาเหตุที่พบ',
        options: [
          {
            value: 'promo-ended',
            label: 'ส่วนลดโปรโมชัน 12 เดือนหมดอายุ',
            suggests: [
              { kind: 'say', text: '"บิลขึ้นเพราะส่วนลดโปรฯ ครบ 12 เดือนพอดีครับ ไม่ใช่ค่าใช้จ่ายแปลกปลอม เดี๋ยวผมหาโปรฯ ใหม่ให้"' },
              { kind: 'do', text: 'แนบหลักฐานบิล + วันที่โปรฯ หมด ติดไปกับคิว' },
            ],
          },
          { value: 'roaming', label: 'ค่าโรมมิ่ง / ใช้ต่างประเทศ' },
          { value: 'overage', label: 'ใช้เกินแพ็กเกจ' },
        ],
      },
    ],
    promoMatch: {
      poolNote: 'โปรฯ ที่เปิดอยู่ตอนนี้ 40+ รายการ',
      reason: 'ลูกค้าภักดี 4 ปี + อ่อนไหวราคา + เพิ่งเสียส่วนลด',
      matched: [
        {
          name: 'Loyalty Save 599 — ตรึงราคาเดิม 12 เดือน',
          why: 'รักษาลูกค้าภักดี ดึงบิลกลับ ฿599 ตรงเหตุผลที่ลูกค้าหัวร้อน',
          price: '฿599/เดือน',
          badge: 'แนะนำ',
        },
        {
          name: 'ส่วนลดออโต้เพย์ -฿50',
          why: 'ลูกค้าหักบัตรอัตโนมัติอยู่แล้ว — ได้สิทธิ์ทันที',
          price: '-฿50/เดือน',
          badge: 'แถมได้',
        },
      ],
    },
    handoff: {
      summary:
        'ลูกค้าภักดี 4 ปี (สูงวัย) หัวร้อนเรื่องบิล +฿300 — สาเหตุจริงคือส่วนลดโปรฯ 12 เดือนหมดอายุ (ไม่ใช่ error) หน้าร้านรับฟัง+อธิบายแล้ว ลูกค้าใจเย็นลง',
      nextAction: 'ต่อโปรฯ Loyalty Save 599 / ใช้สิทธิ์ retention รักษาลูกค้าภักดี',
    },
    service: {
      greeting: 'สวัสดีครับคุณสมชาย ผมเห็นข้อมูลจากหน้าร้านแล้วครับ เรื่องบิลที่สูงขึ้น',
      note: 'Service Staff เปิดเคสมาเห็นข้อมูลครบ — ไม่ต้องถามซ้ำ ลูกค้าไม่ต้องเล่าใหม่',
      steps: [
        { label: 'ทักด้วยชื่อ + ยืนยันว่ารับเรื่องมาแล้ว', detail: 'ลดความหัวร้อนทันที เพราะไม่ต้องเริ่มเล่าใหม่' },
        { label: 'เปิดบิล + จุดที่โปรฯ หมดอายุให้ดู', detail: 'ความโปร่งใสสร้างความไว้ใจ' },
        { label: 'ใช้สิทธิ์ retention ต่อส่วนลดแพ็กเกจ', detail: 'รักษาลูกค้าภักดีไว้' },
      ],
      resolution: {
        title: 'ปิดเคส',
        text: 'ต่อส่วนลดให้ลูกค้า บิลกลับสู่ ฿599 ลูกค้าพอใจ เดินออกแบบอารมณ์ดี',
      },
      upsell: {
        trigger: 'ลูกค้าภักดี + ดูทีวีเยอะ (จากข้อมูลหน้าร้าน)',
        line: '"คุณสมชายดู True Vision อยู่แล้ว เพิ่มแพ็กช่องหนัง/กีฬาอีกนิดเดียวคุ้มกว่านะครับ"',
        offer: 'True Vision NOW add-on',
      },
    },
    impact: {
      metrics: [
        { value: '−67%', label: 'เวลาบริการต่อเคส (12→4 นาที)' },
        { value: '+18 จุด', label: 'คะแนนความพอใจ (CSAT) คาดว่าเพิ่ม' },
        { value: '฿7,188/ปี', label: 'ARPU ที่รักษาไว้ (กันลูกค้าหลุด)' },
      ],
      before: {
        time: '~12 นาที',
        mood: 'หัวร้อนขึ้นเรื่อยๆ',
        steps: ['ถูกชี้ให้ไปกดบัตรคิวเอง', 'รอคิวทั้งที่โมโห', 'เล่าเรื่องใหม่ตั้งแต่ต้นให้ Service', 'Service เริ่มเช็กจากศูนย์'],
      },
      after: {
        time: '~4 นาที',
        mood: 'ใจเย็นลงตั้งแต่หน้าร้าน',
        steps: ['หน้าร้านรับฟัง+วินิจฉัยทันที', 'ข้อมูลส่งต่อไปกับคิว', 'Service ทักด้วยชื่อ รู้เรื่องแล้ว', 'แก้ + ต่อโปรฯ + เสนอ True Vision'],
      },
      wins: [
        { icon: 'smile', label: 'ลดลูกค้าหัวร้อน', text: 'รับฟังตั้งแต่ก้าวแรก ไม่ต้องเล่าซ้ำ' },
        { icon: 'clock', label: 'ประหยัดเวลา ~8 นาที', text: 'Service เริ่มทำงานได้ทันที' },
        { icon: 'wallet', label: 'เพิ่มโอกาส Upsell', text: 'ข้อมูลการใช้งานนำไปสู่ข้อเสนอที่ตรงจุด' },
      ],
    },
  },

  {
    id: 'plan-upgrade',
    personaId: 'nut',
    title: 'พี่นัท — อยากได้เน็ตที่ดีขึ้น',
    tag: 'เคส Upsell · พักเที่ยงสั้น',
    accent: '#0a7c5a',
    walkIn: {
      emoji: '🙂',
      mood: 'อารมณ์ดี / รีบ (พักเที่ยง)',
      headline: 'ลูกค้าวัยทำงานเดินเข้ามาถามด้วยท่าทีเป็นมิตรแต่รีบ',
      quote: 'พอดีเน็ตเต็มบ่อย อยากรู้ว่ามีแพ็กเกจที่ดีกว่านี้ไหมคะ ขอเร็วๆ นะ',
    },
    customer: {
      name: 'คุณนัท วิไลพร',
      phone: '089-222-1188',
      plan: 'True 5G 399 (เน็ต 30GB)',
      tenure: '2 ปี 1 เดือน',
      arpu: '฿399/เดือน',
      segment: 'คนรุ่นใหม่ / ใช้งานหนัก / เทียบ AIS',
      autopay: 'ชำระผ่านแอป • ตรงเวลา',
      insights: [
        'ใช้ดาต้าเกินแพ็กเกจ 5 เดือนติด — เน็ตหน่วงปลายเดือนประจำ',
        'พฤติกรรม: ดูสตรีมมิ่ง/คอนเทนต์วิดีโอสูงมาก',
        'ยังไม่เคยใช้สิทธิ์ 5G เต็มรูปแบบ',
      ],
      history: [
        { date: 'พ.ค. 2567', text: 'สมัครแพ็กเกจ 399' },
        { date: '5 เดือนล่าสุด', text: 'ใช้ดาต้าเกินทุกเดือน เฉลี่ย +12GB' },
      ],
    },
    diagnosis: [
      {
        id: 'reason',
        icon: 'target',
        q: 'ลูกค้ามาเรื่องอะไร?',
        captureLabel: 'เรื่องที่มา',
        options: [
          {
            value: 'package',
            label: 'อยากได้เน็ตเร็วขึ้น / ปรึกษาแพ็กเกจ',
            suggests: [
              { kind: 'do', text: 'เปิดสถิติการใช้ดาต้า 6 เดือนให้ลูกค้าดู — ให้เห็นว่าเน็ตไม่พอจริง' },
            ],
          },
          { value: 'bill', label: 'ค่าบริการ / บิล' },
          { value: 'signal', label: 'สัญญาณ / เน็ตช้า' },
          { value: 'device', label: 'อุปกรณ์ / ซิม' },
        ],
      },
      {
        id: 'need',
        icon: 'lightbulb',
        q: 'จับความต้องการ (เพื่อส่งให้ Service ปิดการขาย)',
        captureLabel: 'ความต้องการ',
        options: [
          {
            value: 'streaming',
            label: 'ดูสตรีมมิ่งเยอะ ต้องการเน็ตไม่อั้น',
            suggests: [
              { kind: 'say', text: '"ดูจากการใช้งานคุณนัทเหมาะกับ 5G ไม่อั้นเลยครับ จะได้ไม่ต้องคอยเช็กเน็ตเหลือ"' },
              { kind: 'upsell', text: 'แมตช์: 5G Together 699 ไม่อั้น + เอนเตอร์เทนเมนต์บันเดิล' },
            ],
          },
          { value: 'gaming', label: 'เล่นเกม ต้องการ ping ต่ำ' },
          { value: 'wfh', label: 'ทำงาน/ประชุมออนไลน์' },
        ],
      },
      {
        id: 'mood',
        icon: 'thermometer',
        q: 'ประเมินอารมณ์ / ความพร้อมซื้อ',
        captureLabel: 'อารมณ์',
        options: [
          {
            value: 'warm',
            label: 'อารมณ์ดี เปิดรับข้อเสนอ',
            suggests: [
              { kind: 'insight', text: 'ลูกค้าพร้อมซื้อ — ส่งคิวพร้อมข้อเสนอที่จัดไว้ ให้ Service ปิดได้เลย' },
            ],
          },
          { value: 'compare', label: 'กำลังเทียบกับค่ายอื่น (AIS)' },
          { value: 'budget', label: 'กังวลเรื่องราคา' },
        ],
      },
    ],
    promoMatch: {
      poolNote: 'โปรฯ ที่เปิดอยู่ตอนนี้ 40+ รายการ',
      reason: 'ใช้ดาต้าเกิน 5 เดือนติด + ดูสตรีมมิ่งหนัก + เทียบ AIS',
      matched: [
        {
          name: '5G Together 699 ไม่อั้น (ความเร็วสูงสุด)',
          why: 'แก้ปัญหาเน็ตหน่วงปลายเดือนตรงจุด — เทียบแล้วคุ้มกว่าแพ็ก AIS ระดับเดียวกัน',
          price: '฿699/เดือน',
          badge: 'แนะนำ',
        },
        {
          name: 'บันเดิลความบันเทิง (Netflix/Viu) +฿100',
          why: 'ลูกค้าดูสตรีมมิ่งหนัก — เพิ่มมูลค่าโดยไม่รู้สึกว่าโดนยัดขาย',
          price: '+฿100/เดือน',
          badge: 'ต่อยอด',
        },
      ],
    },
    handoff: {
      summary:
        'ลูกค้าใช้ดาต้าเกินแพ็กเกจ 5 เดือนติด ดูสตรีมมิ่งหนัก อารมณ์ดีพร้อมรับข้อเสนอ (แต่รีบ) — หน้าร้านจับความต้องการ + จัดข้อเสนอที่ตรงไว้ให้แล้ว',
      nextAction: 'ปิดการขายอัปเกรดเป็น 5G Together 699 ไม่อั้น + เสนอบันเดิล',
    },
    service: {
      greeting: 'สวัสดีค่ะคุณนัท หน้าร้านส่งข้อมูลมาแล้ว เรื่องอยากได้เน็ตไม่อั้นใช่ไหมคะ',
      note: 'Service Staff ไม่ต้อง cold-pitch — ข้อเสนอที่ตรงใจถูกจัดมาให้จากข้อมูลการใช้งานจริง',
      steps: [
        { label: 'ยืนยันความต้องการจากข้อมูลหน้าร้าน', detail: 'ไม่ต้องถามใหม่ ลูกค้ารู้สึกว่าเราเข้าใจ' },
        { label: 'โชว์สถิติการใช้ดาต้า + เทียบแพ็กเกจ', detail: 'ปิดการขายด้วยข้อมูลจริง ไม่ใช่ขายดะ' },
        { label: 'เสนอบันเดิลความบันเทิงเสริม', detail: 'Upsell ต่อยอดจาก preference ที่จับได้' },
      ],
      resolution: {
        title: 'ปิดการขาย',
        text: 'อัปเกรดเป็น 5G Together 699 ไม่อั้น ARPU +฿300 ลูกค้าได้ของที่ต้องการจริง',
      },
      upsell: {
        trigger: 'ดูสตรีมมิ่งหนัก (จากข้อมูลหน้าร้าน)',
        line: '"เพิ่มแพ็กดูหนัง/ซีรีส์อีกนิดเดียว คุ้มกว่าสมัครแยกนะคะ"',
        offer: 'เอนเตอร์เทนเมนต์บันเดิล + เครื่องผ่อน 0%',
      },
    },
    impact: {
      metrics: [
        { value: '−50%', label: 'เวลาบริการ (10→5 นาที)' },
        { value: '+฿3,600/ปี', label: 'ARPU เพิ่มจาก upsell (+฿300/ด.)' },
        { value: '×2', label: 'โอกาสปิดการขาย (เสนอตรงจุด)' },
      ],
      before: {
        time: '~10 นาที',
        mood: 'ลังเล อาจเดินจากไปเทียบค่ายอื่น',
        steps: ['กดบัตรคิว ถามทั่วไป', 'Service ขายแบบเดา ไม่รู้ความต้องการ', 'ลูกค้ารู้สึกโดนยัดขาย', 'ปิดการขายยาก'],
      },
      after: {
        time: '~5 นาที',
        mood: 'มั่นใจ ได้ของที่ตรงใจ',
        steps: ['หน้าร้านจับความต้องการจากข้อมูลจริง', 'ส่งข้อเสนอที่ตรงไปกับคิว', 'Service เสนอตรงจุด ปิดได้เร็ว', 'ต่อยอด upsell บันเดิล'],
      },
      wins: [
        { icon: 'target', label: 'ขายตรงความต้องการ', text: 'ข้อมูลการใช้งานจริงนำการเสนอ ไม่ใช่ขายเดา' },
        { icon: 'trendingup', label: 'Conversion สูงขึ้น', text: 'ลูกค้าไม่รู้สึกโดนยัดขาย ปิดง่ายขึ้น' },
        { icon: 'wallet', label: 'ARPU +฿300 + บันเดิล', text: 'โอกาส upsell ถูกจัดมาให้ตั้งแต่หน้าร้าน' },
      ],
    },
  },

  {
    id: 'retention',
    personaId: 'ae',
    title: 'คุณเอ — จะยกเลิก / ย้ายค่าย',
    tag: 'เคส Retention · เสี่ยง churn',
    accent: '#7c3aed',
    walkIn: {
      emoji: '😤',
      mood: 'หมดความอดทน / ตัดสินใจแล้ว',
      headline: 'ลูกค้าเดินตรงมาหน้าร้านเพื่อขอยกเลิก',
      quote: 'จะมายกเลิกเบอร์กับเน็ตบ้านครับ ย้ายบ้านแล้วด้วย ขอจบเร็วๆ',
    },
    customer: {
      name: 'คุณเอ รัตนพล',
      phone: '062-781-4420',
      plan: 'True 5G Together 599 + True Online 1Gbps',
      tenure: '3 ปี',
      arpu: '฿1,089/เดือน (รวมเน็ตบ้าน)',
      segment: 'ลูกค้าเดิม แต่ “ใจจะไป”',
      autopay: 'ชำระผ่านแอป • มียอดค้าง 1 รอบบิล',
      insights: [
        'เหตุผลยกเลิก: ย้ายบ้าน + มีเบอร์สำรอง dtac',
        'มูลค่ารวมต่อปีสูง (~฿13,000) — คุ้มที่จะรักษา',
        'พื้นที่บ้านใหม่มีไฟเบอร์ True รองรับ (เช็คจาก GIS)',
      ],
      history: [
        { date: '3 ปีที่แล้ว', text: 'สมัครมือถือ + เน็ตบ้าน convergence' },
        { date: 'เดือนนี้', text: 'ย้ายบ้าน → ตั้งใจมายกเลิก' },
      ],
    },
    diagnosis: [
      {
        id: 'reason',
        icon: 'target',
        q: 'ลูกค้ามาเรื่องอะไร?',
        captureLabel: 'เรื่องที่มา',
        options: [
          {
            value: 'cancel',
            label: 'ยกเลิก / ย้ายค่าย',
            suggests: [
              { kind: 'do', text: 'ถามเหตุผลที่แท้จริงก่อน — อย่าเพิ่งเสนอโปร เดี๋ยวเหมือนตื๊อ' },
            ],
          },
          { value: 'bill', label: 'ยอดค้างชำระ' },
          { value: 'signal', label: 'สัญญาณ / เน็ตช้า' },
          { value: 'package', label: 'เปลี่ยนแพ็กเกจ' },
        ],
      },
      {
        id: 'why',
        icon: 'search',
        q: 'เหตุผลจริงที่จะยกเลิก',
        captureLabel: 'เหตุผล',
        options: [
          {
            value: 'moved',
            label: 'ย้ายบ้าน (คิดว่าที่ใหม่ไม่มีสัญญาณ)',
            flag: 'priority',
            suggests: [
              { kind: 'insight', text: 'ระบบ GIS: บ้านใหม่มีไฟเบอร์ True รองรับ — ย้ายเลขที่ติดตั้งได้ ไม่ต้องยกเลิก' },
              { kind: 'say', text: '"ที่อยู่ใหม่ของคุณเอใช้ True ได้ครับ เราย้ายให้ฟรี ไม่ต้องเริ่มสัญญาใหม่"' },
            ],
          },
          { value: 'price', label: 'แพงไป / มีเบอร์สำรองแล้ว' },
          { value: 'service', label: 'ไม่พอใจบริการที่ผ่านมา' },
        ],
      },
      {
        id: 'mood',
        icon: 'thermometer',
        q: 'ประเมินความอดทน',
        captureLabel: 'อารมณ์',
        options: [
          {
            value: 'impatient',
            label: 'หมดความอดทน / รีบ',
            flag: 'priority',
            suggests: [
              { kind: 'insight', text: 'ตั้งคิว "ด่วน" + เคลียร์ยอดค้างเตรียมไว้ ลดการวนพิสูจน์เอกสาร' },
            ],
          },
          { value: 'open', label: 'พอเปิดใจฟังถ้าคุ้มจริง' },
        ],
      },
    ],
    promoMatch: {
      poolNote: 'โปรฯ + สิทธิ์ retention ที่เปิดอยู่ 40+ รายการ',
      reason: 'เหตุผลจริง = ย้ายบ้าน (ไม่ใช่ราคา) + มูลค่าลูกค้าสูง',
      matched: [
        {
          name: 'ย้ายเลขที่ติดตั้งเน็ตบ้าน (ฟรี)',
          why: 'แก้เหตุผลจริงตรงจุด — บ้านใหม่มีไฟเบอร์ True รองรับ ไม่ต้องยกเลิก',
          price: 'ฟรีค่าย้าย',
          badge: 'แนะนำ',
        },
        {
          name: 'Win-back -25% 6 เดือน + เคลียร์ยอดค้าง',
          why: 'รักษาลูกค้ามูลค่าสูง (~฿13,000/ปี) ให้เหตุผลที่คุ้มพอจะอยู่ต่อ',
          price: '-25% 6 เดือน',
          badge: 'สิทธิ์ retention',
        },
      ],
    },
    handoff: {
      summary:
        'ลูกค้ามูลค่าสูง (~฿13,000/ปี) ตั้งใจยกเลิกเพราะย้ายบ้าน (เข้าใจผิดว่าที่ใหม่ไม่มีสัญญาณ) — GIS ยืนยันบ้านใหม่ใช้ True ได้ หน้าร้านเสนอย้ายเลขที่ติดตั้งฟรีแล้ว ลูกค้าเริ่มเปิดใจ',
      nextAction: 'ย้ายเลขที่ติดตั้ง (ไม่ยกเลิก) + เคลียร์ยอดค้าง + win-back -25%',
    },
    service: {
      greeting: 'สวัสดีครับคุณเอ ผมเห็นแล้วว่าจะย้ายบ้าน — ข่าวดีคือที่ใหม่ใช้ True ได้เลยครับ',
      note: 'Service Staff รู้เหตุผลจริงตั้งแต่ต้น — เปลี่ยนจาก “ยกเลิก” เป็น “ย้ายบริการ” ได้ทันที',
      steps: [
        { label: 'ยืนยันบ้านใหม่มีสัญญาณ (โชว์ GIS)', detail: 'พลิกความเข้าใจผิดที่เป็นต้นเหตุการยกเลิก' },
        { label: 'เสนอย้ายเลขที่ติดตั้งฟรี + เคลียร์ยอดค้าง', detail: 'ลดแรงเสียดทาน ให้ลูกค้ารู้สึกเป็นธรรม' },
        { label: 'ใช้สิทธิ์ win-back -25% 6 เดือน', detail: 'ปิดด้วยข้อเสนอที่คุ้มจริง ไม่ใช่ตื๊อ' },
      ],
      resolution: {
        title: 'รักษาลูกค้าไว้',
        text: 'เปลี่ยนจากยกเลิกเป็นย้ายบริการ + ส่วนลด ลูกค้าอยู่ต่อ รักษารายได้ ~฿13,000/ปี',
      },
      upsell: {
        trigger: 'ย้ายบ้านใหม่ (จากข้อมูลหน้าร้าน)',
        line: '"บ้านใหม่ติดกล้อง TrueX ดูผ่านมือถือได้ อุ่นใจช่วงเพิ่งย้ายนะครับ"',
        offer: 'TrueX กล้องวงจรปิด + แพ็กติดตั้ง',
      },
    },
    impact: {
      metrics: [
        { value: '−60%', label: 'เวลาบริการ (20→8 นาที)' },
        { value: '฿13,000/ปี', label: 'มูลค่าลูกค้าที่กันไม่ให้หลุด' },
        { value: '1→0', label: 'เปลี่ยน “ยกเลิก” เป็น “ย้ายบริการ”' },
      ],
      before: {
        time: '~20 นาที',
        mood: 'ยกเลิกสำเร็จ เสียลูกค้า',
        steps: ['กดบัตรคิว retention รอนาน', 'พนักงานเสนอโปรมั่วๆ (เหมือนตื๊อ)', 'ไม่รู้เหตุผลจริง = ย้ายบ้าน', 'ลูกค้ายกเลิก เสียรายได้ทั้งก้อน'],
      },
      after: {
        time: '~8 นาที',
        mood: 'รู้สึกถูกดูแล อยู่ต่อ',
        steps: ['หน้าร้านขุดเหตุผลจริง (ย้ายบ้าน)', 'GIS ยืนยันบ้านใหม่ใช้ได้', 'เสนอย้าย+ส่วนลดตรงจุด', 'รักษาลูกค้ามูลค่าสูงไว้'],
      },
      wins: [
        { icon: 'shieldcheck', label: 'กัน churn ลูกค้ามูลค่าสูง', text: 'รักษารายได้ ~฿13,000/ปี ที่กำลังจะหลุด' },
        { icon: 'target', label: 'แก้เหตุผลจริง ไม่ใช่ตื๊อ', text: 'เปลี่ยน “ยกเลิก” เป็น “ย้ายบริการ”' },
        { icon: 'clock', label: 'ลดเวลา + ลดการวนเอกสาร', text: 'เคลียร์ยอดค้าง/คิวด่วนเตรียมไว้ล่วงหน้า' },
      ],
    },
  },
]

export function getScenario(id) {
  return WELCOMER_SCENARIOS.find((s) => s.id === id) || null
}

// Deterministic so a live pitch shows the same plausible numbers every run
// (no Math.random surprises mid-demo). Stable hash from the seed id.
function hashSeed(s) {
  let h = 2166136261
  for (let i = 0; i < String(s).length; i++) {
    h ^= String(s).charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// queue numbers — a fresh "new-format" code (e.g. B8823) per the field note that
// True is moving to a new queue-number scheme.
export function makeQueueNumber(seedId) {
  const letter = { 'package': 'B', 'device': 'C', 'new-sim': 'S', 'bill': 'P', 'retention': 'R', 'signal': 'T' }[seedId] || 'A'
  const n = 1000 + (hashSeed(seedId) % 9000)
  return `${letter}${n}`
}

// Stable, plausible wait estimate for the True Queue ticket (no randomness).
export function queueEstimate(seedId) {
  const h = hashSeed(seedId)
  const position = 1 + (h % 3) // 1–3 คิวก่อนหน้า
  const waitMin = position * 4 + (h % 4) + 2 // ~6–18 นาที, สมเหตุสมผล
  return { waitMin, position }
}
