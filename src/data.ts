import { Product, Order, Coupon } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Corrente Grumet Escamada 8mm - Moeda Antiga',
    description: 'A Corrente Grumet Escamada de 8mm é a nossa peça de maior prestígio. Fabricada artesanalmente em Moeda Antiga de altíssima pureza e banhada com 10 Milésimos de Ouro 18K, possui o tom, peso e brilho idênticos ao ouro maciço. O fecho gaveta triplo garante máxima segurança com acabamento cirúrgico de alta joalheria. Uma joia indestrutível projetada para durar gerações.',
    price: 349.90,
    originalPrice: 499.90,
    category: 'correntes',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80'
    ],
    weight: '45g - 55g',
    length: ['60cm', '70cm', '80cm'],
    thickness: '8mm',
    clasp: ['Gaveta com Trava Dupla', 'Mosquetão Luxo', 'Canhão Bodin'],
    plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Suíço antialérgico)',
    rating: 4.9,
    reviewsCount: 124,
    reviews: [
      {
        id: 'r1',
        author: 'Gustavo Mendonça',
        rating: 5,
        text: 'Surreal a qualidade dessa corrente. Já tenho há 6 meses, tomo banho de mar, piscina e continua impecável, com o mesmo brilho de quando tirei da caixa. O fecho gaveta é extremamente seguro.',
        date: '12/05/2026',
        verifiedPurchase: true
      },
      {
        id: 'r2',
        author: 'Felipe Alencar',
        rating: 5,
        text: 'Comprei a de 70cm. O peso dela no pescoço dá aquela sensação premium maravilhosa. Ninguém diz que não é ouro maciço de 50 mil reais. Atendimento no WhatsApp foi nota 10.',
        date: '28/06/2026',
        verifiedPurchase: true
      },
      {
        id: 'r3',
        author: 'Rodrigo S.',
        rating: 4,
        text: 'Muito bonita e brilhante. O acabamento dos elos é perfeito. Demorou só 1 dia a mais do prazo de entrega por conta dos Correios, mas a joia em si é irretocável.',
        date: '04/07/2026',
        verifiedPurchase: true
      }
    ],
    stock: 25,
    isBestSeller: true,
    isNew: false
  },
  {
    id: '2',
    name: 'Corrente Cadeado Longo 6mm - Moeda Antiga',
    description: 'Minimalismo de luxo em sua melhor forma. A Corrente Cadeado de 6mm combina elos perfeitamente soldados em moeda antiga com banho premium de Ouro 18K. Uma peça versátil e elegante que transmite sofisticação discreta. Possui excelente durabilidade e acabamento polido espelhado.',
    price: 279.90,
    originalPrice: 389.90,
    category: 'correntes',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80'
    ],
    weight: '32g - 38g',
    length: ['60cm', '70cm'],
    thickness: '6mm',
    clasp: ['Mosquetão Luxo', 'Gaveta com Trava Dupla'],
    plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Suíço antialérgico)',
    rating: 4.8,
    reviewsCount: 89,
    reviews: [
      {
        id: 'r4',
        author: 'Thiago Nogueira',
        rating: 5,
        text: 'Joia extremamente fina e polida. O fecho mosquetão é forte e prático. Combina com tudo, uso no dia a dia sem medo nenhum.',
        date: '10/06/2026',
        verifiedPurchase: true
      }
    ],
    stock: 18,
    isBestSeller: false,
    isNew: true
  },
  {
    id: '3',
    name: 'Pulseira Grumet Escamada 8mm - Moeda Antiga',
    description: 'O complemento perfeito para o seu estilo. A Pulseira Grumet Escamada de 8mm traz a presença imponente da moeda antiga banhada a Ouro 18K diretamente para o pulso. Combina perfeitamente com a Corrente Grumet de 8mm para formar o conjunto Bodin Signature.',
    price: 189.90,
    originalPrice: 249.90,
    category: 'pulseiras',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    weight: '18g - 22g',
    length: ['19cm', '21cm', '23cm'],
    thickness: '8mm',
    clasp: ['Gaveta com Trava Dupla', 'Mosquetão Luxo'],
    plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Suíço antialérgico)',
    rating: 4.9,
    reviewsCount: 76,
    reviews: [
      {
        id: 'r5',
        author: 'Carlos Eduardo',
        rating: 5,
        text: 'Comprei o conjunto de corrente e pulseira. Ficou absurdo de lindo. O banho é muito resistente, trabalho com produtos químicos leves às vezes e ela continua intacta.',
        date: '02/07/2026',
        verifiedPurchase: true
      }
    ],
    stock: 30,
    isBestSeller: true,
    isNew: false
  },
  {
    id: '4',
    name: 'Corrente Cartier Fina 4mm - Moeda Antiga',
    description: 'Elos finos com simetria impecável inspirados na alta joalheria francesa. A Corrente Cartier de 4mm em Moeda Antiga com banho de Ouro 18K é a definição de luxo sutil. Perfeita para usar com pingentes ou sozinha para um toque discreto de classe.',
    price: 229.90,
    originalPrice: 299.90,
    category: 'correntes',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    weight: '22g - 26g',
    length: ['60cm', '70cm'],
    thickness: '4mm',
    clasp: ['Mosquetão Luxo', 'Canhão Bodin'],
    plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Suíço antialérgico)',
    rating: 4.7,
    reviewsCount: 45,
    reviews: [],
    stock: 12,
    isBestSeller: false,
    isNew: false
  },
  {
    id: '5',
    name: 'Anel Imperador Cravejado Royal - Ouro 18K',
    description: 'Um símbolo de poder, riqueza e exclusividade. O Anel Imperador Bodin possui design robusto com laterais trabalhadas e o topo cravejado com 42 micro-zircônias lapidadas da mais alta pureza (brilho equivalente a diamantes VVS). Uma obra-prima banhada a ouro 18k.',
    price: 249.90,
    originalPrice: 349.90,
    category: 'aneis',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [],
    weight: '14g - 18g',
    length: ['Aro 18', 'Aro 20', 'Aro 22', 'Aro 24', 'Aro 26'],
    thickness: 'Varia por tamanho',
    clasp: ['Anel Inteiriço Anatômico'],
    plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz de Nano-Proteção)',
    rating: 5.0,
    reviewsCount: 32,
    reviews: [
      {
        id: 'r6',
        author: 'Arthur Reis',
        rating: 5,
        text: 'Simplesmente o anel mais imponente que já tive. O brilho das pedras à noite sob luz artificial é inacreditável. Encaixe anatômico super confortável.',
        date: '15/07/2026',
        verifiedPurchase: true
      }
    ],
    stock: 8,
    isBestSeller: true,
    isNew: true
  },
  {
    id: '6',
    name: 'Pulseira Tijolinho Luxo 6mm - Moeda Antiga',
    description: 'Design moderno com estrutura robusta e elos que se encaixam como tijolos dourados. A Pulseira Tijolinho de 6mm é ideal para homens modernos que valorizam a simetria perfeita e o peso expressivo de uma joia de moeda antiga banhada a Ouro 18K.',
    price: 169.90,
    originalPrice: 229.90,
    category: 'pulseiras',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80'
    ],
    weight: '15g - 18g',
    length: ['19cm', '21cm'],
    thickness: '6mm',
    clasp: ['Gaveta com Trava Dupla', 'Mosquetão Luxo'],
    plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Suíço antialérgico)',
    rating: 4.6,
    reviewsCount: 29,
    reviews: [],
    stock: 14,
    isBestSeller: false,
    isNew: false
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'BODIN10', discountType: 'percentage', value: 10, active: true },
  { code: 'BODINDOURO', discountType: 'fixed', value: 50, active: true },
  { code: 'BOASVINDAS', discountType: 'percentage', value: 5, active: true }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9842',
    customerName: 'Marcus Vinícius Castro',
    customerEmail: 'marcus.castro@gmail.com',
    customerPhone: '11999998888',
    address: {
      cep: '04571-010',
      street: 'Avenida das Nações Unidas',
      number: '12901',
      complement: 'Torre Oeste - Apto 142',
      neighborhood: 'Brooklin Paulista',
      city: 'São Paulo',
      state: 'SP'
    },
    items: [
      {
        productId: '1',
        productName: 'Corrente Grumet Escamada 8mm - Moeda Antiga',
        price: 349.90,
        quantity: 1,
        length: '70cm',
        clasp: 'Gaveta com Trava Dupla'
      },
      {
        productId: '3',
        productName: 'Pulseira Grumet Escamada 8mm - Moeda Antiga',
        price: 189.90,
        quantity: 1,
        length: '21cm',
        clasp: 'Gaveta com Trava Dupla'
      }
    ],
    subtotal: 539.80,
    discount: 53.98,
    shipping: 0.00,
    total: 485.82,
    paymentMethod: 'pix',
    status: 'paid',
    date: '2026-07-22T14:35:00Z'
  },
  {
    id: 'ORD-7512',
    customerName: 'André Silva Prado',
    customerEmail: 'andre.prado@yahoo.com.br',
    customerPhone: '21988887777',
    address: {
      cep: '22021-001',
      street: 'Avenida Atlântica',
      number: '1702',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    items: [
      {
        productId: '5',
        productName: 'Anel Imperador Cravejado Royal - Ouro 18K',
        price: 249.90,
        quantity: 1,
        length: 'Aro 22',
        clasp: 'Anel Inteiriço Anatômico'
      }
    ],
    subtotal: 249.90,
    discount: 0.00,
    shipping: 25.00,
    total: 274.90,
    paymentMethod: 'credit_card',
    status: 'paid',
    date: '2026-07-21T09:12:00Z'
  },
  {
    id: 'ORD-5431',
    customerName: 'Renato Albuquerque',
    customerEmail: 'renato.albuq@gmail.com',
    customerPhone: '31977776666',
    address: {
      cep: '30110-002',
      street: 'Avenida do Contorno',
      number: '4500',
      complement: 'Bloco C - Sala 802',
      neighborhood: 'Funcionários',
      city: 'Belo Horizonte',
      state: 'MG'
    },
    items: [
      {
        productId: '2',
        productName: 'Corrente Cadeado Longo 6mm - Moeda Antiga',
        price: 279.90,
        quantity: 1,
        length: '60cm',
        clasp: 'Mosquetão Luxo'
      }
    ],
    subtotal: 279.90,
    discount: 27.99,
    shipping: 0.00,
    total: 251.91,
    paymentMethod: 'mercado_pago',
    status: 'delivered',
    date: '2026-07-18T16:45:00Z'
  },
  {
    id: 'ORD-1234',
    customerName: 'Sandro Moreira',
    customerEmail: 'sandro.m@outlook.com',
    customerPhone: '51966665555',
    address: {
      cep: '90010-001',
      street: 'Rua dos Andradas',
      number: '1000',
      neighborhood: 'Centro Histórico',
      city: 'Porto Alegre',
      state: 'RS'
    },
    items: [
      {
        productId: '6',
        productName: 'Pulseira Tijolinho Luxo 6mm - Moeda Antiga',
        price: 169.90,
        quantity: 1,
        length: '19cm',
        clasp: 'Mosquetão Luxo'
      }
    ],
    subtotal: 169.90,
    discount: 0.00,
    shipping: 19.90,
    total: 189.80,
    paymentMethod: 'pix',
    status: 'pending',
    date: '2026-07-23T11:20:00Z'
  }
];

export const SYSTEM_BENEFITS = [
  {
    title: 'Garantia Eterna',
    description: 'Nossas joias de Moeda Antiga não enferrujam, não descascam e possuem garantia vitalícia do metal.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Banho de 10 Milésimos',
    description: 'Altíssima concentração de Ouro 18K de verdade + Verniz Suíço antialérgico selador protetor.',
    icon: 'Award'
  },
  {
    title: 'Frete Grátis Brasil',
    description: 'Envio com rastreamento detalhado seguro e seguro contra extravios para qualquer estado.',
    icon: 'Truck'
  },
  {
    title: 'Suporte VIP WhatsApp',
    description: 'Consultores especializados de prontidão para tirar dúvidas, auxiliar na compra e enviar fotos reais.',
    icon: 'MessageCircle'
  }
];
