
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 127 bytes].XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);


// CATALOGO IA - REAL: produtos de arranque por ramo. Inseridos em produtos_loja com conta_id. Stock 10 armazem + 10 loja, alguns diferentes.
const CATALOGO_IA_FERRAGEM = [{nome:"Cimento 50kg",cat:"Cimento",preco:850,arm:30,loja:30},
{nome:"Cimento Branco 25kg",cat:"Cimento",preco:950,arm:10,loja:10},
{nome:"Varão 6mm 6m",cat:"Ferro",preco:220,arm:10,loja:10},
{nome:"Varão 8mm 6m",cat:"Ferro",preco:380,arm:10,loja:10},
{nome:"Varão 10mm 6m",cat:"Ferro",preco:550,arm:10,loja:10},
{nome:"Varão 12mm 6m",cat:"Ferro",preco:750,arm:10,loja:10},
{nome:"Varão 16mm 6m",cat:"Ferro",preco:1100,arm:10,loja:10},
{nome:"Varão 20mm 6m",cat:"Ferro",preco:1650,arm:10,loja:10},
{nome:"Arame Recozido 1kg",cat:"Arame",preco:180,arm:20,loja:20},
{nome:"Arame Galvanizado 1kg",cat:"Arame",preco:220,arm:10,loja:10},
{nome:"Arame Farpado 500m",cat:"Arame",preco:2800,arm:10,loja:10},
{nome:"Rede Galvanizada 1m",cat:"Arame",preco:450,arm:10,loja:10},
{nome:"Pregos 1 polegada 1kg",cat:"Pregos",preco:150,arm:50,loja:50},
{nome:"Pregos 2 polegadas 1kg",cat:"Pregos",preco:150,arm:50,loja:50},
{nome:"Pregos 3 polegadas 1kg",cat:"Pregos",preco:150,arm:50,loja:50},
{nome:"Pregos 4 polegadas 1kg",cat:"Pregos",preco:150,arm:50,loja:50},
{nome:"Pregos 5 polegadas 1kg",cat:"Pregos",preco:150,arm:30,loja:30},
{nome:"Pregos 6 polegadas 1kg",cat:"Pregos",preco:150,arm:30,loja:30},
{nome:"Tubo PVC 50mm 6m",cat:"Tubos",preco:650,arm:10,loja:10},
{nome:"Tubo PVC 75mm 6m",cat:"Tubos",preco:950,arm:10,loja:10},
{nome:"Tubo PVC 110mm 6m",cat:"Tubos",preco:1450,arm:10,loja:10},
{nome:"Tubo PVC 40mm 6m",cat:"Tubos",preco:480,arm:10,loja:10},
{nome:"Tubo Galvanizado 1/2 6m",cat:"Tubos",preco:1200,arm:10,loja:10},
{nome:"Tubo Galvanizado 3/4 6m",cat:"Tubos",preco:1500,arm:10,loja:10},
{nome:"Tubo PPR 20mm 4m",cat:"Tubos",preco:380,arm:10,loja:10},
{nome:"Tubo PPR 25mm 4m",cat:"Tubos",preco:480,arm:10,loja:10},
{nome:"Joelho PVC 50mm",cat:"Conexões",preco:90,arm:20,loja:20},
{nome:"Joelho PVC 75mm",cat:"Conexões",preco:130,arm:20,loja:20},
{nome:"Joelho PVC 110mm",cat:"Conexões",preco:220,arm:10,loja:10},
{nome:"T PVC 50mm",cat:"Conexões",preco:110,arm:20,loja:20},
{nome:"T PVC 75mm",cat:"Conexões",preco:150,arm:20,loja:20},
{nome:"Redução PVC 110-75",cat:"Conexões",preco:140,arm:10,loja:10},
{nome:"Tampa PVC 110mm",cat:"Conexões",preco:120,arm:10,loja:10},
{nome:"Cola PVC 500ml",cat:"Conexões",preco:350,arm:10,loja:10},
{nome:"Areia Fina 1m3",cat:"Areia",preco:1800,arm:10,loja:10},
{nome:"Areia Grossa 1m3",cat:"Areia",preco:1800,arm:10,loja:10},
{nome:"Brita 1m3",cat:"Brita",preco:2200,arm:10,loja:10},
{nome:"Pedra 1m3",cat:"Brita",preco:2000,arm:10,loja:10},
{nome:"Bloco 10cm",cat:"Blocos",preco:35,arm:50,loja:50},
{nome:"Bloco 15cm",cat:"Blocos",preco:40,arm:50,loja:50},
{nome:"Bloco 20cm",cat:"Blocos",preco:50,arm:50,loja:50},
{nome:"Tijolo 1un",cat:"Blocos",preco:25,arm:50,loja:50},
{nome:"Chapa Zincada 3m",cat:"Chapas",preco:1800,arm:10,loja:10},
{nome:"Chapa Zincada 4m",cat:"Chapas",preco:2400,arm:10,loja:10},
{nome:"Chapa Zincada 5m",cat:"Chapas",preco:3000,arm:10,loja:10},
{nome:"Chapa Ondulada 3m",cat:"Chapas",preco:1500,arm:10,loja:10},
{nome:"Chapa Ondulada 4m",cat:"Chapas",preco:2000,arm:10,loja:10},
{nome:"Chapa Galvanizada 6m",cat:"Chapas",preco:3600,arm:10,loja:10},
{nome:"Tubo Quadrado 40mm 6m",cat:"Ferro",preco:950,arm:10,loja:10},
{nome:"Cantoneira 40mm 6m",cat:"Ferro",preco:850,arm:10,loja:10},
{nome:"Tinta Branca 5L",cat:"Tintas",preco:1800,arm:10,loja:10},
{nome:"Tinta Branca 20L",cat:"Tintas",preco:5500,arm:10,loja:10},
{nome:"Tinta Cinza 5L",cat:"Tintas",preco:1800,arm:10,loja:10},
{nome:"Tinta Azul 5L",cat:"Tintas",preco:1900,arm:10,loja:10},
{nome:"Tinta Verde 5L",cat:"Tintas",preco:1900,arm:10,loja:10},
{nome:"Tinta Amarela 5L",cat:"Tintas",preco:1900,arm:10,loja:10},
{nome:"Tinta Vermelha 5L",cat:"Tintas",preco:1900,arm:10,loja:10},
{nome:"Primário 5L",cat:"Tintas",preco:1500,arm:10,loja:10},
{nome:"Massa Corrida 5kg",cat:"Tintas",preco:650,arm:10,loja:10},
{nome:"Massa Corrida 20kg",cat:"Tintas",preco:1800,arm:10,loja:10},
{nome:"Pincel 2 polegadas",cat:"Ferramentas",preco:180,arm:10,loja:10},
{nome:"Pincel 4 polegadas",cat:"Ferramentas",preco:250,arm:10,loja:10},
{nome:"Rolo de Pintura",cat:"Ferramentas",preco:350,arm:10,loja:10},
{nome:"Trincha 3 polegadas",cat:"Ferramentas",preco:220,arm:10,loja:10},
{nome:"Martelo",cat:"Ferramentas",preco:450,arm:10,loja:10},
{nome:"Alicate Universal",cat:"Ferramentas",preco:550,arm:10,loja:10},
{nome:"Alicate de Corte",cat:"Ferramentas",preco:480,arm:10,loja:10},
{nome:"Chave de Fendas",cat:"Ferramentas",preco:250,arm:10,loja:10},
{nome:"Chave Phillips",cat:"Ferramentas",preco:250,arm:10,loja:10},
{nome:"Serra de Mão",cat:"Ferramentas",preco:650,arm:10,loja:10},
{nome:"Esquadro",cat:"Ferramentas",preco:300,arm:10,loja:10},
{nome:"Fita Métrica 5m",cat:"Ferramentas",preco:280,arm:10,loja:10},
{nome:"Nível 60cm",cat:"Ferramentas",preco:750,arm:10,loja:10},
{nome:"Colher de Pedreiro",cat:"Ferramentas",preco:380,arm:10,loja:10},
{nome:"Parafuso 3x30 1kg",cat:"Parafusos",preco:220,arm:30,loja:30},
{nome:"Parafuso 4x40 1kg",cat:"Parafusos",preco:250,arm:30,loja:30},
{nome:"Parafuso 5x50 1kg",cat:"Parafusos",preco:250,arm:30,loja:30},
{nome:"Bucha 6mm 100un",cat:"Parafusos",preco:180,arm:20,loja:20},
{nome:"Bucha 8mm 100un",cat:"Parafusos",preco:220,arm:20,loja:20},
{nome:"Bucha 10mm 100un",cat:"Parafusos",preco:280,arm:20,loja:20},
{nome:"Fechadura Porta",cat:"Fechaduras",preco:950,arm:10,loja:10},
{nome:"Dobradiça 100mm par",cat:"Fechaduras",preco:350,arm:10,loja:10},
{nome:"Dobradiça 75mm par",cat:"Fechaduras",preco:280,arm:10,loja:10},
{nome:"Puxador Porta",cat:"Fechaduras",preco:420,arm:10,loja:10},
{nome:"Cadeado 40mm",cat:"Fechaduras",preco:650,arm:10,loja:10},
{nome:"Cadeado 50mm",cat:"Fechaduras",preco:850,arm:10,loja:10},
{nome:"Cadeado 60mm",cat:"Fechaduras",preco:1050,arm:10,loja:10},
{nome:"Cal Hidratada 20kg",cat:"Cal",preco:550,arm:10,loja:10},
{nome:"Gesso 20kg",cat:"Cal",preco:750,arm:10,loja:10},
{nome:"Silicone Transparente",cat:"Colas",preco:450,arm:10,loja:10},
{nome:"Cola Madeira 1L",cat:"Colas",preco:550,arm:10,loja:10},
{nome:"Cola Contacto 1L",cat:"Colas",preco:750,arm:10,loja:10},
{nome:"Lixa 80",cat:"Lixas",preco:60,arm:30,loja:30},
{nome:"Lixa 120",cat:"Lixas",preco:60,arm:30,loja:30},
{nome:"Lixa 220",cat:"Lixas",preco:60,arm:30,loja:30},
{nome:"Balde 20L",cat:"Baldes",preco:350,arm:10,loja:10},
{nome:"Bacia Plástica",cat:"Baldes",preco:280,arm:10,loja:10},
{nome:"Carrinho de Mão",cat:"Ferramentas",preco:4500,arm:10,loja:10},
{nome:"Pá",cat:"Ferramentas",preco:650,arm:10,loja:10},
{nome:"Enxada",cat:"Ferramentas",preco:750,arm:10,loja:10}];
const CATALOGO_IA_MERCEARIA = [{nome:"Arroz Branco 10kg",cat:"Básicos",preco:1250,arm:10,loja:10},
{nome:"Arroz Branco 25kg",cat:"Básicos",preco:2900,arm:10,loja:10},
{nome:"Arroz 5kg",cat:"Básicos",preco:650,arm:10,loja:10},
{nome:"Arroz 2kg",cat:"Básicos",preco:280,arm:10,loja:10},
{nome:"Arroz 1kg",cat:"Básicos",preco:150,arm:10,loja:10},
{nome:"Feijão Nhemba 2kg",cat:"Básicos",preco:420,arm:10,loja:10},
{nome:"Feijão Nhemba 5kg",cat:"Básicos",preco:980,arm:10,loja:10},
{nome:"Feijão Manteiga 2kg",cat:"Básicos",preco:450,arm:10,loja:10},
{nome:"Feijão Frade 2kg",cat:"Básicos",preco:430,arm:10,loja:10},
{nome:"Feijão Vermelho 2kg",cat:"Básicos",preco:440,arm:10,loja:10},
{nome:"Óleo Girassol 1L",cat:"Óleos",preco:380,arm:10,loja:10},
{nome:"Óleo Girassol 2L",cat:"Óleos",preco:720,arm:10,loja:10},
{nome:"Óleo Girassol 5L",cat:"Óleos",preco:1750,arm:10,loja:10},
{nome:"Óleo Soja 1L",cat:"Óleos",preco:350,arm:10,loja:10},
{nome:"Azeite 500ml",cat:"Óleos",preco:650,arm:10,loja:10},
{nome:"Açúcar 2kg",cat:"Básicos",preco:220,arm:10,loja:10},
{nome:"Açúcar 5kg",cat:"Básicos",preco:520,arm:10,loja:10},
{nome:"Açúcar 1kg",cat:"Básicos",preco:115,arm:10,loja:10},
{nome:"Açúcar Mascavado 1kg",cat:"Básicos",preco:180,arm:10,loja:10},
{nome:"Farinha Milho 1kg",cat:"Básicos",preco:95,arm:10,loja:10},
{nome:"Farinha Milho 5kg",cat:"Básicos",preco:450,arm:10,loja:10},
{nome:"Farinha Trigo 1kg",cat:"Básicos",preco:110,arm:10,loja:10},
{nome:"Farinha Trigo 2kg",cat:"Básicos",preco:210,arm:10,loja:10},
{nome:"Farinha Mandioca 1kg",cat:"Básicos",preco:120,arm:10,loja:10},
{nome:"Leite Longa Vida 1L",cat:"Lacticínios",preco:165,arm:10,loja:10},
{nome:"Leite em Pó 500g",cat:"Lacticínios",preco:550,arm:10,loja:10},
{nome:"Leite em Pó 1kg",cat:"Lacticínios",preco:1050,arm:10,loja:10},
{nome:"Leite Condensado",cat:"Lacticínios",preco:180,arm:10,loja:10},
{nome:"Iogurte 500ml",cat:"Lacticínios",preco:150,arm:10,loja:10},
{nome:"Queijo 1kg",cat:"Lacticínios",preco:850,arm:10,loja:10},
{nome:"Manteiga 500g",cat:"Lacticínios",preco:480,arm:10,loja:10},
{nome:"Margarina 500g",cat:"Lacticínios",preco:320,arm:10,loja:10},
{nome:"Sal 1kg",cat:"Básicos",preco:60,arm:10,loja:10},
{nome:"Sal 2kg",cat:"Básicos",preco:115,arm:10,loja:10},
{nome:"Sabão em Barra",cat:"Limpeza",preco:250,arm:10,loja:10},
{nome:"Sabão em Pó Omo 500g",cat:"Limpeza",preco:180,arm:10,loja:10},
{nome:"Sabão em Pó Omo 1kg",cat:"Limpeza",preco:340,arm:10,loja:10},
{nome:"Detergente Louça 750ml",cat:"Limpeza",preco:220,arm:10,loja:10},
{nome:"Lixívia 1L",cat:"Limpeza",preco:150,arm:10,loja:10},
{nome:"Detergente Chão 1L",cat:"Limpeza",preco:280,arm:10,loja:10},
{nome:"Esponja Louça",cat:"Limpeza",preco:80,arm:20,loja:20},
{nome:"Vassoura",cat:"Limpeza",preco:350,arm:10,loja:10},
{nome:"Pá de Lixo",cat:"Limpeza",preco:250,arm:10,loja:10},
{nome:"Coca-Cola 500ml",cat:"Bebidas",preco:80,arm:20,loja:20},
{nome:"Coca-Cola 1L",cat:"Bebidas",preco:140,arm:10,loja:10},
{nome:"Sumo Laranja 1L",cat:"Bebidas",preco:180,arm:10,loja:10},
{nome:"Sumo Manga 1L",cat:"Bebidas",preco:180,arm:10,loja:10},
{nome:"Água Mineral 500ml",cat:"Bebidas",preco:40,arm:30,loja:30},
{nome:"Água Mineral 1.5L",cat:"Bebidas",preco:70,arm:20,loja:20},
{nome:"Cerveja 330ml",cat:"Bebidas",preco:120,arm:10,loja:10},
{nome:"Vinho Tinto 750ml",cat:"Bebidas",preco:650,arm:10,loja:10},
{nome:"Pão 1un",cat:"Padaria",preco:30,arm:30,loja:30},
{nome:"Pão de Forma",cat:"Padaria",preco:180,arm:10,loja:10},
{nome:"Bolo 1un",cat:"Padaria",preco:250,arm:10,loja:10},
{nome:"Bolacha Maria",cat:"Padaria",preco:120,arm:10,loja:10},
{nome:"Bolacha Água e Sal",cat:"Padaria",preco:110,arm:10,loja:10},
{nome:"Ovos 10un",cat:"Básicos",preco:350,arm:10,loja:10},
{nome:"Ovos 30un",cat:"Básicos",preco:950,arm:10,loja:10},
{nome:"Massa Esparguete 500g",cat:"Básicos",preco:120,arm:10,loja:10},
{nome:"Massa Macarrão 500g",cat:"Básicos",preco:120,arm:10,loja:10},
{nome:"Massa Cotovelo 500g",cat:"Básicos",preco:120,arm:10,loja:10},
{nome:"Atum em Lata",cat:"Enlatados",preco:280,arm:10,loja:10},
{nome:"Sardinha em Lata",cat:"Enlatados",preco:220,arm:10,loja:10},
{nome:"Feijão em Lata",cat:"Enlatados",preco:180,arm:10,loja:10},
{nome:"Milho em Lata",cat:"Enlatados",preco:200,arm:10,loja:10},
{nome:"Tomate Pelado Lata",cat:"Enlatados",preco:150,arm:10,loja:10},
{nome:"Molho Tomate 500g",cat:"Molhos",preco:140,arm:10,loja:10},
{nome:"Ketchup 500g",cat:"Molhos",preco:220,arm:10,loja:10},
{nome:"Maionese 500g",cat:"Molhos",preco:280,arm:10,loja:10},
{nome:"Mostarda 500g",cat:"Molhos",preco:250,arm:10,loja:10},
{nome:"Vinagre 750ml",cat:"Molhos",preco:130,arm:10,loja:10},
{nome:"Chá Preto 100g",cat:"Bebidas Quentes",preco:180,arm:10,loja:10},
{nome:"Chá Verde 100g",cat:"Bebidas Quentes",preco:220,arm:10,loja:10},
{nome:"Café 250g",cat:"Bebidas Quentes",preco:450,arm:10,loja:10},
{nome:"Café 500g",cat:"Bebidas Quentes",preco:850,arm:10,loja:10},
{nome:"Chocolate em Pó 500g",cat:"Bebidas Quentes",preco:380,arm:10,loja:10},
{nome:"Leite Achocolatado 1L",cat:"Bebidas Quentes",preco:220,arm:10,loja:10},
{nome:"Batata 1kg",cat:"Hortifruti",preco:90,arm:10,loja:10},
{nome:"Cebola 1kg",cat:"Hortifruti",preco:110,arm:10,loja:10},
{nome:"Tomate 1kg",cat:"Hortifruti",preco:130,arm:10,loja:10},
{nome:"Alho 1kg",cat:"Hortifruti",preco:350,arm:10,loja:10},
{nome:"Cenoura 1kg",cat:"Hortifruti",preco:120,arm:10,loja:10},
{nome:"Repolho 1un",cat:"Hortifruti",preco:150,arm:10,loja:10},
{nome:"Banana 1kg",cat:"Hortifruti",preco:80,arm:10,loja:10},
{nome:"Maçã 1kg",cat:"Hortifruti",preco:220,arm:10,loja:10},
{nome:"Laranja 1kg",cat:"Hortifruti",preco:150,arm:10,loja:10},
{nome:"Amendoim 500g",cat:"Snacks",preco:180,arm:10,loja:10},
{nome:"Amendoim 1kg",cat:"Snacks",preco:340,arm:10,loja:10},
{nome:"Chips 100g",cat:"Snacks",preco:90,arm:20,loja:20},
{nome:"Chocolate Barra",cat:"Snacks",preco:150,arm:10,loja:10},
{nome:"Rebuçados 100un",cat:"Snacks",preco:250,arm:10,loja:10},
{nome:"Pastilha Elástica",cat:"Snacks",preco:50,arm:30,loja:30},
{nome:"Papel Higiénico 4 rolos",cat:"Higiene",preco:220,arm:10,loja:10},
{nome:"Papel Higiénico 12 rolos",cat:"Higiene",preco:580,arm:10,loja:10},
{nome:"Sabonete 1un",cat:"Higiene",preco:90,arm:20,loja:20},
{nome:"Shampoo 500ml",cat:"Higiene",preco:380,arm:10,loja:10},
{nome:"Pasta Dentífrica",cat:"Higiene",preco:180,arm:10,loja:10},
{nome:"Escova de Dentes",cat:"Higiene",preco:150,arm:10,loja:10},
{nome:"Fraldas M 20un",cat:"Higiene",preco:850,arm:10,loja:10},
{nome:"Fraldas L 20un",cat:"Higiene",preco:880,arm:10,loja:10},
{nome:"Pensinho 10un",cat:"Higiene",preco:120,arm:20,loja:20},
{nome:"Pilhas AA 4un",cat:"Outros",preco:180,arm:10,loja:10},
{nome:"Pilhas AAA 4un",cat:"Outros",preco:180,arm:10,loja:10},
{nome:"Vela 1un",cat:"Outros",preco:60,arm:20,loja:20},
{nome:"Fósforos 10cx",cat:"Outros",preco:100,arm:20,loja:20},
{nome:"Saco Plástico 1kg",cat:"Outros",preco:150,arm:10,loja:10}];
function catalogoIA(ramo:string){ const r=String(ramo||'').toLowerCase();
 if(r.includes('ferrag')||r.includes('constru')||r.includes('material')) return CATALOGO_IA_FERRAGEM;
 if(r.includes('mercearia')||r.includes('merce')||r.includes('mini')) return CATALOGO_IA_MERCEARIA;
 if(r.includes('farm')){ const bases=['Paracetamol','Amoxicilina','Ibuprofeno','Vitamina C','Omeprazol','Ciprofloxacina','Metronidazol','Diclofenac','Cetirizina','Albendazol','Arteméter','Quinina','Aspirina','Multivitaminas','Xarope Tosse','Soro Oral','Pomada Antibiótica','Álcool 70%','Algodão','Gaze','Esparadrapo','Luvas','Seringa','Termómetro','Tensiômetro','Curativo','Betadine','Captopril','Amlodipina','Metformina','Glibenclamida','Furosemida','Prednisolona','Hidrocortisona','Clotrimazol','Miconazol','Fluconazol','Doxiciclina','Azitromicina','Ceftriaxona','Gentamicina','Insulina','Salbutamol','Budesonida','Loratadina','Ranitidina','Tramadol','Diazepam','Fenobarbital','Cloroquina']; const out:any[]=[]; bases.forEach((b,i)=>{ out.push({nome:b+' 500mg',cat:'Farmácia',preco:180+i*5,arm:10,loja:10}); out.push({nome:b+' 250mg',cat:'Farmácia',preco:150+i*5,arm:10,loja:10}); }); return out.slice(0,100); }
 if(r.includes('roupa')||r.includes('vest')||r.includes('boutique')){ const modelos=['Camisete','Calça Jeans','Camisa','Vestido','Saia','Casaco','Calções','Blusa','T-shirt','Calça Social','Macacão','Sweater','Jaqueta','Meias','Cinto','Boné','Chapéu','Sapatos','Sandálias','Chinelos','Meia-calça','Pijama','Roupa Interior','Bermuda','Top']; const tams=['S','M','L','XL']; const out:any[]=[]; modelos.forEach((m,i)=>tams.forEach((tm)=>out.push({nome:m+' '+tm,cat:'Roupa',preco:450+i*20,arm:10,loja:10}))); return out.slice(0,100); }
 if(r.includes('eletr')||r.includes('electric')){ const bases=['Lâmpada LED 9W','Lâmpada LED 12W','Fio Elétrico 1.5mm','Fio Elétrico 2.5mm','Interruptor Simples','Interruptor Duplo','Tomada Simples','Tomada Dupla','Disjuntor 16A','Disjuntor 32A','Quadro Elétrico','Fita Isolante','Cabo Extensão 5m','Cabo Extensão 10m','Carregador Telefone','Power Bank','Auriculares','Coluna Bluetooth','Lanterna','Pilha Recarregável','Ventoinha','Ferro de Engomar','Chaleira Elétrica','Fogão Elétrico','Micro-ondas','Frigorífico','TV 32','TV 43','Antena','Descodificador','Roteador WiFi','Cabo HDMI','Cabo USB','Adaptador','Fusível','Bocal','Suporte TV','Campainha','Sensor Movimento','Relógio Parede','Extensão Tripla','Placa Solar 100W','Bateria Solar','Inversor','Candeeiro','Abajur','Tubo LED','Reator','Contator','Relé']; const out:any[]=[]; bases.forEach((b,i)=>{ out.push({nome:b,cat:'Elétrica',preco:350+i*15,arm:10,loja:10}); out.push({nome:b+' - 2un',cat:'Elétrica',preco:650+i*15,arm:10,loja:10}); }); return out.slice(0,100); }
 return CATALOGO_IA_MERCEARIA; }


// FOTO IA: foto gerada por IA por nome do produto. URL deterministica, sem chave. O dono pode substituir pela foto real.
function fotoIA(nome:string){ const prompt='Product photo of '+String(nome||'')+', single product, centered, on clean white background, supermarket product photo, realistic, no text, no people'; return 'https://image.pollinations.ai/prompt/'+encodeURIComponent(prompt)+'?width=800&height=800&seed='+encodeURIComponent(String(nome||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'))+'&nologo=true'; }

export default function VenderFixIVATabs(){
  const [lojaLogada, setLojaLogada] = useState<any>(null);
  const [negocioTab, setNegocioTab] = useState<'painel'|'faturar'|'vender'|'stock'|'clientes'|'fornecedores'|'caixa'|'relatorios'>('painel');
  const [stockProdutos, setStockProdutos] = useState<any[]>([]);
  const [faturas, setFaturas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [dataStockDiario, setDataStockDiario] = useState(new Date().toISOString().slice(0,10));
  const [filtroRapidoStock, setFiltroRapidoStock] = useState('');
  // RELATORIO REAL - filtros (não mock)
  const [relFiltroProduto, setRelFiltroProduto] = useState('Todos');
  const [relFiltroGrupo, setRelFiltroGrupo] = useState('Todos');
  const [relDataInicio, setRelDataInicio] = useState('');
  const [relDataFim, setRelDataFim] = useState('');
  const [relAplicado, setRelAplicado] = useState(false);
  const [fornecedores, setFornecedores] = useState<any[]>([]); // REAL: carregado por loja (conta_id) - loja nova nao ve fornecedores da outra
  const [formForn, setFormForn] = useState({nome:'', tel:'', produto:'', nota:''});
  const [caixaTurno, setCaixaTurno] = useState<'Manha'|'Tarde'|'Noite'>('Manha');
  const [armazemAtivo, setArmazemAtivo] = useState('Todos');
  const [mostrarNovoItem, setMostrarNovoItem] = useState(false);
  const [fotoFile, setFotoFile] = useState<any>(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [ramoIA, setRamoIA] = useState('Ferragem');
  const [aPreencherIA, setAPreencherIA] = useState(false);
  const [mostrarEntrada, setMostrarEntrada] = useState(false);
  const [mostrarSaida, setMostrarSaida] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [qtdEntrada, setQtdEntrada] = useState('');
  const [qtdSaida, setQtdSaida] = useState('');
  const [tipoSaida, setTipoSaida] = useState<'saida_usa'|'transferencia'>('transferencia');

  // FATURAR V90 - IVA FUNCIONAL
  const [produtosFat, setProdutosFat] = useState<any[]>([]);
  // TELA PRODUTOS - REAL, vem de stockProdutos (produtos_loja) - nada de mock
  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [buscaProd, setBuscaProd] = useState('');
  const [catProd, setCatProd] = useState('Todos');
  const emojiProd = (p:any)=>{ const n=String(p.nome||'').toLowerCase(); const c=String(p.cat||'').toLowerCase(); if(n.includes('cimento')||n.includes('areia')||n.includes('bloco')) return '🏗️'; if(n.includes('arroz')) return '🍚'; if(n.includes('oleo')||n.includes('óleo')) return '🫗'; if(n.includes('feij')) return '🫘'; if(n.includes('acucar')||n.includes('açúcar')) return '🧂'; if(n.includes('leite')) return '🥛'; if(n.includes('farinha')||n.includes('milho')) return '🌽'; if(n.includes('sabao')||n.includes('sabão')||n.includes('omo')||n.includes('deterg')) return '🧼'; if(n.includes('coca')||n.includes('refriger')||n.includes('sumo')) return '🥤'; if(n.includes('pao')||n.includes('pão')) return '🍞'; if(n.includes('ovo')) return '🥚'; if(c.includes('cimento')||c.includes('constru')) return '🏗️'; if(c.includes('limpeza')) return '🧼'; if(c.includes('bebida')) return '🥤'; return '🛒'; };
  const tirarDoFaturar = (p:any)=>{ const item=produtosFat.find((x:any)=>x.id===p.id); if(!item) return; if(item.qtd<=1) setProdutosFat(produtosFat.filter((x:any)=>x.id!==p.id)); else setProdutosFat(produtosFat.map((x:any)=>x.id===p.id?{...x,qtd:x.qtd-1}:x)); };
  const catsReais = ['Todos', ...Array.from(new Set(stockProdutos.map((p:any)=>p.cat||'Outros')))] as string[];
  const [buscaFat, setBuscaFat] = useState('');
  const [telFat, setTelFat] = useState('');
  const [nomeFat, setNomeFat] = useState('');
  const [nuitFat, setNuitFat] = useState('');
  const [ivaTipo, setIvaTipo] = useState<'0'|'5'|'16'>('16'); // Local apenas, não grava no Supabase

  const [formNovoItem, setFormNovoItem] = useState({codigo:'', nome:'', marca:'', categoria:'Cimento', preco:'', stockInicialArmazem:'', stockInicialLoja:'', armazem:'Matola - Principal'});
  const [perfilEdit, setPerfilEdit] = useState({nomeLoja:'', nuit:'', endereco:'', provincia:'', distrito:'', ramo:'', tel:'', password:'', novaPassword:'', logoData:'', funcionarios: [] as any[]});

  const [mostrarLogin, setMostrarLogin] = useState<'cadastro'|'login'>('cadastro');
  const [formLojaLogin, setFormLojaLogin] = useState({nomeLoja:'', tel:'', password:'', nuit:'', endereco:'', provincia:'', distrito:'', ramo:'', logoData:''}); // REAL: loja nova comeca vazia, sem dados da loja anterior

  const criarContaLoja = async () => {
    if(!formLojaLogin.nomeLoja || !formLojaLogin.tel || !formLojaLogin.password){ alert('Nome, Telefone e Password'); return; }
    const conta_id = `conta_${Date.now()}`;
    const novaLoja:any = { conta_id, nome_loja: formLojaLogin.nomeLoja, username: formLojaLogin.tel, password: formLojaLogin.password, nuit: formLojaLogin.nuit, endereco: formLojaLogin.endereco, provincia: formLojaLogin.provincia, cidade: formLojaLogin.distrito, ramo: formLojaLogin.ramo, logoData: formLojaLogin.logoData };
    try{
      const { error } = await supabase.from('lojas').insert([novaLoja]);
      if(error){ console.log(error); }
      localStorage.setItem('loja_sessao', JSON.stringify(novaLoja));
      setLojaLogada(novaLoja);
      setPerfilEdit({nomeLoja:novaLoja.nome_loja||'', nuit:novaLoja.nuit||'', endereco:novaLoja.endereco||'', provincia:novaLoja.provincia||'', distrito:novaLoja.cidade||'', ramo:novaLoja.ramo||'', tel:novaLoja.username||'', password:'', novaPassword:'', logoData:novaLoja.logoData||'', funcionarios: []});
      carregarTudo(novaLoja.conta_id);
    }catch(e:any){ alert(e.message); }
  };

  const fazerLoginLoja = async () => {
    if(!formLojaLogin.tel || !formLojaLogin.password){ alert('Telefone e Password'); return; }
    const { data, error } = await supabase.from('lojas').select('*').eq('username', formLojaLogin.tel).eq('password', formLojaLogin.password).limit(1);
    if(error || !data || data.length===0){ alert('Loja não encontrada - verifica telefone e password ou cria conta'); return; }
    const loja = data[0];
    localStorage.setItem('loja_sessao', JSON.stringify(loja));
    setLojaLogada(loja);
    setPerfilEdit({nomeLoja:loja.nome_loja||'', nuit:loja.nuit||'', endereco:loja.endereco||'', provincia:loja.provincia||'', distrito:loja.cidade||'', ramo:loja.ramo||'', tel:loja.username||'', password:'', novaPassword:'', logoData:loja.logoData||'', funcionarios: loja.funcionarios||[]});
    carregarTudo(loja.conta_id);
  };

  const [novoFunc, setNovoFunc] = useState({nome:'', tel:'', password:'', cargo:'Vendedor Caixa'});

  useEffect(()=>{
    const sessao = localStorage.getItem('loja_sessao');
    if(sessao){ try{ const l=JSON.parse(sessao); setLojaLogada(l); carregarTudo(l.conta_id); setPerfilEdit({nomeLoja:l.nome_loja||'', nuit:l.nuit||'', endereco:l.endereco||'', provincia:l.provincia||'', distrito:l.cidade||'', ramo:l.ramo||'', tel:l.username||'', password:'', novaPassword:'', logoData:l.logoData||'', funcionarios: l.funcionarios||[]}); }catch(e){} }
  },[]);
  useEffect(()=>{ if(lojaLogada?.conta_id){ try{ const v=JSON.parse(localStorage.getItem(`loja_fornecedores_${lojaLogada.conta_id}`)||'[]'); setFornecedores(v); }catch(e){ setFornecedores([]); } } },[lojaLogada?.conta_id]);

  const carregarTudo = async (conta_id:string) => {
    setCarregando(true);
    const { data: prods, error: errP } = await supabase.from('produtos_loja').select('*').eq('conta_id', conta_id).order('created_at',{ascending:true});
    if(errP) console.error(errP);
    const { data: fats } = await supabase.from('faturas_loja').select('*').eq('conta_id', conta_id).order('created_at',{ascending:false});
    const lista = (prods||[]).map((p:any)=>{
      const stockInicialArm = p.stock_inicial_armazem ?? p.stock_armazem ?? 0;
      const entrada = p.entrada ?? 0;
      const saida = p.saida ?? 0;
      const stockFinalArm = stockInicialArm + entrada - saida;
      const stockInicialLoja = p.stock_inicial_loja ?? p.stock_loja ?? 0;
      const recepcao = p.recepcao ?? 0;
      const vendaHoje = p.venda_hoje ?? 0;
      const stockFinalLoja = stockInicialLoja + recepcao - vendaHoje;
      return {...p, codigo:p.codigo||`COD-${Math.floor(Math.random()*90000)+10000}`, dataEntrada:p.created_at?new Date(p.created_at).toISOString().slice(0,10):dataStockDiario, stockInicialArmazem:stockInicialArm, entrada, saida, stockFinalArmazem:stockFinalArm, stockInicialLoja, recepcao, vendaHoje, stockFinalLoja, stockTotal:stockFinalArm+stockFinalLoja, precoUnit:p.preco||0, armazem:p.armazem||'Matola - Principal'};
    });
    setStockProdutos(lista);
    setFaturas((fats as any)||[]);
    setCarregando(false);
  };

  const salvarNovoItemReal = async () => {
    if(!formNovoItem.nome || !formNovoItem.codigo){ alert('Código e Nome'); return; }
    let fotoUrl = '';
    if(!fotoFile && fotoPreview && fotoPreview.startsWith('https://')) fotoUrl = fotoPreview;
    if(fotoFile){ try{ fotoUrl = await new Promise<string>((res)=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const max=800; const sc=Math.min(1,max/Math.max(img.width,img.height)); c.width=Math.max(1,img.width*sc); c.height=Math.max(1,img.height*sc); const ctx=c.getContext('2d'); ctx?.drawImage(img,0,0,c.width,c.height); res(c.toDataURL('image/jpeg',0.7)); }; img.src=URL.createObjectURL(fotoFile); }); }catch(e){ fotoUrl=fotoPreview||''; } }
    const novo:any = { conta_id: lojaLogada.conta_id, codigo: formNovoItem.codigo, nome: formNovoItem.nome, cat: formNovoItem.categoria, preco: parseFloat(formNovoItem.preco)||0, stock_armazem: parseInt(formNovoItem.stockInicialArmazem)||0, stock_loja: parseInt(formNovoItem.stockInicialLoja)||0, stock_inicial_armazem: parseInt(formNovoItem.stockInicialArmazem)||0, stock_inicial_loja: parseInt(formNovoItem.stockInicialLoja)||0, entrada:0, saida:0, recepcao:0, venda_hoje:0, armazem: formNovoItem.armazem, marca: formNovoItem.marca, foto_url: fotoUrl||null };
    let { error } = await supabase.from('produtos_loja').insert([novo]); if(error && String(error.message||'').toLowerCase().includes('foto')){ const {foto_url, ...semFoto}:any = novo; const r2 = await supabase.from('produtos_loja').insert([semFoto]); error = r2.error as any; if(!error) alert('Produto criado SEM foto: corre no Supabase: ALTER TABLE produtos_loja ADD COLUMN IF NOT EXISTS foto_url text;'); } if(error) alert(error.message); else { setMostrarNovoItem(false); setFotoFile(null); setFotoPreview(''); setFormNovoItem({codigo:'', nome:'', marca:'', categoria:'Cimento', preco:'', stockInicialArmazem:'', stockInicialLoja:'', armazem:'Matola - Principal'}); carregarTudo(lojaLogada.conta_id); }
  };

  const gerarFotoIAProduto = async (p:any) => { if(!confirm(`Gerar foto com IA para ${p.nome}?`)) return; const url = fotoIA(p.nome); const { error } = await supabase.from('produtos_loja').update({ foto_url: url }).eq('id', p.id); if(error) alert(error.message); else { alert('Foto IA criada para '+p.nome); carregarTudo(lojaLogada.conta_id); } };
  const gerarFotosIATodos = async () => { if(!lojaLogada?.conta_id) return; const semFoto = (stockProdutos||[]).filter((p:any)=>!p.foto_url); if(semFoto.length===0){ alert('Todos os produtos já têm foto.'); return; } if(!confirm(`Gerar foto com IA para ${semFoto.length} produto(s) sem foto?`)) return; for(const p of semFoto){ await supabase.from('produtos_loja').update({ foto_url: fotoIA(p.nome) }).eq('id', p.id); } alert(`Fotos IA criadas para ${semFoto.length} produtos.`); carregarTudo(lojaLogada.conta_id); };
  const preencherStockIA = async () => { if(!lojaLogada?.conta_id){ alert('Entra na conta da loja primeiro'); return; } const catalogo = catalogoIA(ramoIA); if(stockProdutos.length>0 && !confirm(`Esta conta já tem ${stockProdutos.length} produto(s). Queres adicionar mais ${catalogo.length} de ${ramoIA} sem apagar os que já existem? (nomes iguais serão ignorados)`)) return; setAPreencherIA(true); const existentes = new Set((stockProdutos||[]).map((p:any)=>String(p.nome||'').toLowerCase())); const novos = catalogo.filter((c:any)=>!existentes.has(String(c.nome).toLowerCase())).map((c:any,i:number)=>({ conta_id: lojaLogada.conta_id, codigo: `IA-${ramoIA.slice(0,3).toUpperCase()}-${String(i+1).padStart(3,'0')}`, nome: c.nome, cat: c.cat, preco: c.preco, stock_armazem: c.arm, stock_loja: c.loja, stock_inicial_armazem: c.arm, stock_inicial_loja: c.loja, entrada:0, saida:0, recepcao:0, venda_hoje:0, armazem: 'Matola - Principal', marca: 'IA - '+ramoIA, foto_url: fotoIA(c.nome) })); let inseridos=0; for(let i=0;i<novos.length;i+=50){ const { error } = await supabase.from('produtos_loja').insert(novos.slice(i,i+50)); if(error){ alert('Erro IA: '+error.message); break; } inseridos += Math.min(50, novos.length-i); } setAPreencherIA(false); alert(`IA: ${inseridos} produtos de ${ramoIA} adicionados ao stock real, com foto IA. Edita preço/stock/foto.`); carregarTudo(lojaLogada.conta_id); };
  const fazerEntradaReal = async () => {
    if(!produtoSelecionado || !qtdEntrada) return;
    const qtd = parseInt(qtdEntrada)||0;
    const novoEntrada = produtoSelecionado.entrada + qtd;
    const novoFinalArm = produtoSelecionado.stockInicialArmazem + novoEntrada - produtoSelecionado.saida;
    await supabase.from('produtos_loja').update({ entrada: novoEntrada, stock_armazem: novoFinalArm }).eq('id', produtoSelecionado.id);
    alert(`Entrada [F5] - ${qtd} - finalArm ${novoFinalArm}`); setMostrarEntrada(false); setQtdEntrada(''); setProdutoSelecionado(null); carregarTudo(lojaLogada.conta_id);
  };

  const fazerSaidaReal = async () => {
    if(!produtoSelecionado || !qtdSaida) return;
    const qtd = parseInt(qtdSaida)||0;
    if(tipoSaida==='saida_usa'){
      if(qtd > produtoSelecionado.stockFinalArmazem){ alert('Stock insuficiente'); return; }
      const novoSaida = produtoSelecionado.saida + qtd;
      const novoFinalArm = produtoSelecionado.stockInicialArmazem + produtoSelecionado.entrada - novoSaida;
      await supabase.from('produtos_loja').update({ saida: novoSaida, stock_armazem: novoFinalArm }).eq('id', produtoSelecionado.id);
    } else {
      if(qtd > produtoSelecionado.stockFinalArmazem){ alert('Stock insuficiente'); return; }
      const novoSaida = produtoSelecionado.saida + qtd;
      const novoFinalArm = produtoSelecionado.stockInicialArmazem + produtoSelecionado.entrada - novoSaida;
      const novaRecepcao = produtoSelecionado.recepcao + qtd;
      const novoFinalLoja = produtoSelecionado.stockInicialLoja + novaRecepcao - produtoSelecionado.vendaHoje;
      await supabase.from('produtos_loja').update({ saida: novoSaida, stock_armazem: novoFinalArm, recepcao: novaRecepcao, stock_loja: novoFinalLoja }).eq('id', produtoSelecionado.id);
    }
    setMostrarSaida(false); setQtdSaida(''); setProdutoSelecionado(null); carregarTudo(lojaLogada.conta_id);
  };

  const adicionarAoFaturar = (p:any) => {
    const disp = p.stockFinalLoja;
    const noCarrinho = produtosFat.find(x=>x.id===p.id);
    if((noCarrinho?.qtd||0)+1 > disp){ alert(`Stock loja insuficiente! Tem ${disp}`); return; }
    if(noCarrinho) setProdutosFat(produtosFat.map(x=>x.id===p.id?{...x,qtd:x.qtd+1}:x));
    else setProdutosFat([...produtosFat, {...p, qtd:1, desc:0, preco: p.precoUnit}]);
  };

  // NUMERO FATURA - 01TM06/11/26 : 01=numero do dia+turno, TM=turno, 06/11/26=data. Reinicia cada dia e cada turno.
  const gerarNumeroFatura = (turnoNome:string) => {
    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2,'0');
    const mm = String(hoje.getMonth()+1).padStart(2,'0');
    const yy = String(hoje.getFullYear()).slice(2);
    const dataCurta = `${dd}/${mm}/${yy}`;
    const codTurno = turnoNome==='Manha' ? 'TM' : turnoNome==='Tarde' ? 'TT' : 'TN';
    const hojeISO = hoje.toISOString().slice(0,10);
    const hojePT = hoje.toLocaleDateString('pt-MZ');
    const count = (faturas||[]).filter((fat:any)=>{
      const nf = String(fat.numero_fatura||'');
      if(nf && nf.includes(codTurno+dataCurta)) return true;
      if(nf) return false;
      const d = String(fat.data||fat.created_at||'');
      const isHoje = d.slice(0,10)===hojeISO || d.includes(hojePT) || d.includes(`${dd}/${mm}/${hoje.getFullYear()}`);
      return isHoje;
    }).length;
    const seq = String(count+1).padStart(2,'0');
    return `${seq}${codTurno}${dataCurta}`;
  };
  // PDF VERDADEIRO - sem biblioteca, gera PDF real .pdf (nao HTML)
  const criarPdfBlob = (titulo:string, linhas:string[]) => {
    const esc = (s:string)=> s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E\u00C0-\u00FF]/g,' ');
    let content = 'BT /F1 11 Tf 40 780 Td 14 TL ';
    content += `(${esc(titulo)}) Tj T* T* `;
    linhas.forEach((l:string)=>{ const partes = l.match(/.{1,95}/g) || [l]; partes.forEach((p:string)=>{ content += `(${esc(p)}) Tj T* `; }); });
    content += 'ET';
    const objs:string[] = [];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
    objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objs[5] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    let pdf = '%PDF-1.4\n';
    const offsets:number[] = [0];
    for(let i=1;i<=5;i++){ offsets[i]=pdf.length; pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
    const xrefPos = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    for(let i=1;i<=5;i++){ pdf += String(offsets[i]).padStart(10,'0') + ' 00000 n \n'; }
    pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF';
    return new Blob([pdf], {type:'application/pdf'});
  };
  // ANULAR FATURA - volta stock, tira de tudo (Caixa, Clientes, Relatorios)
  const anularFatura = async (fat:any) => {
    if(!confirm(`Anular ${fat.numero_fatura || 'fatura'} - ${fat.cliente} - ${fat.total}MT ? O stock vai voltar!`)) return;
    const prods = Array.isArray(fat.produtos) ? fat.produtos : [];
    for(let item of prods){
      const prod = stockProdutos.find((pr:any)=> pr.id===item.id || pr.nome===item.nome);
      if(prod){
        const novaVenda = Math.max(0, (prod.vendaHoje||0) - Number(item.qtd||0));
        const novoFinal = (prod.stockInicialLoja||0) + (prod.recepcao||0) - novaVenda;
        await supabase.from('produtos_loja').update({ venda_hoje: novaVenda, stock_loja: novoFinal }).eq('id', prod.id);
      }
    }
    const { error } = await supabase.from('faturas_loja').update({ status: 'ANULADA', is_divida: false }).eq('id', fat.id);
    if(error){ alert('Erro anular: '+error.message); return; }
    alert(`Fatura ANULADA! Stock voltou!`);
    carregarTudo(lojaLogada.conta_id);
  };
  const salvarFaturaDuplaFuncao = async (isDivida:boolean) => {
    if(produtosFat.length===0){ alert('Adicione produtos'); return; }
    if(!telFat && !nomeFat){ alert('Telefone ou nome'); return; }
    const subtotalBruto = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
    const descontoItens = produtosFat.reduce((s,p)=>s+p.preco*p.qtd*p.desc/100,0);
    const subtotalLiquido = subtotalBruto - descontoItens;
    const ivaPerc = ivaTipo==='16'?16: ivaTipo==='5'?5:0;
    const ivaValor = subtotalLiquido * ivaPerc / 100;
    const total = subtotalLiquido + ivaValor;
    // FIX: NÃO enviar ivaTipo para Supabase, só dados que existem
    const numeroFatura = gerarNumeroFatura(caixaTurno);
    const nomeClienteFatura = (nomeFat||telFat||'Cliente Balcao').trim();
    const nova:any = { conta_id: lojaLogada.conta_id, cliente: nomeFat||telFat, tel: telFat, nuit: nuitFat||null, produtos: produtosFat, total, status: isDivida?'DIVIDA':'PAGO', is_divida: isDivida, data: new Date().toLocaleString('pt-MZ') }; // FIX: numero_fatura e turno sao SO locais para PDF/WhatsApp/nome ficheiro, NAO gravam no Supabase - igual ivaTipo
    const { error } = await supabase.from('faturas_loja').insert([nova]);
    if(error){ alert('Erro fatura: '+error.message); return; }
    for(let item of produtosFat){
      const prod = stockProdutos.find(pr=>pr.id===item.id);
      if(prod){ const novaVenda = prod.vendaHoje + item.qtd; const novoFinalLoja = prod.stockInicialLoja + prod.recepcao - novaVenda; await supabase.from('produtos_loja').update({ venda_hoje: novaVenda, stock_loja: novoFinalLoja }).eq('id', prod.id); }
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'}</title><style>body{font-family:Arial;padding:20px;font-size:11px;max-width:700px;margin:auto} .top{display:flex;justify-content:space-between} .logo{width:60px;height:60px;border-radius:50%;background:#1e2f4a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;overflow:hidden} .logo img{width:100%;height:100%;object-fit:cover} .amarelo{background:#facc15;padding:6px 10px;font-weight:900;text-align:center;margin:12px 0} table{width:100%;border-collapse:collapse;margin-top:8px} th,td{border:1px solid #ddd;padding:6px;font-size:10px} th{background:#f1f5f9;text-align:left} .tot{text-align:right;margin-top:10px;line-height:1.7} .tot b{background:#facc15;padding:6px 10px;display:inline-block}</style></head><body><div class="top"><div style="display:flex;gap:12px"><div class="logo">${perfilEdit.logoData ? `<img src="${perfilEdit.logoData}" />` : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div><div><b style="font-size:14px">${lojaLogada.nome_loja}</b><br/>NUIT: ${lojaLogada.nuit} | Tel: +${lojaLogada.username}<br/>${lojaLogada.endereco||'Maputo'}</div></div><div>Cliente: ${nomeClienteFatura}<br/>Tel: ${telFat}<br/>NUIT: ${nuitFat||'-'}<br/>Data: ${new Date().toLocaleDateString('pt-MZ')}<br/>Status: ${isDivida?'DIVIDA':'PAGO'}</div></div><div class="amarelo">Fatura N\u00BA: ${numeroFatura}</div><table><thead><tr><th>DESCRICAO</th><th>QTD</th><th>PRECO</th><th>DESC%</th><th>SUBTOTAL</th></tr></thead><tbody>${produtosFat.map(p=>`<tr><td>${p.nome}</td><td>${p.qtd}</td><td>${p.preco}MT</td><td>${p.desc}%</td><td>${(p.preco*p.qtd*(1-p.desc/100)).toFixed(0)}MT</td></tr>`).join('')}</tbody></table><div class="tot">Subtotal: ${subtotalLiquido.toFixed(0)}MT<br/>Desconto: -${descontoItens.toFixed(0)}MT<br/>IVA (${ivaPerc}%): ${ivaValor.toFixed(0)}MT<br/><b>TOTAL: ${total.toFixed(0)}MT</b></div></body></html>`;
    // DOWNLOAD AUTOMATICO - sem clicar Save: PDF (HTML) + Excel (CSV) + WhatsApp no mesmo clique - igual Relatorios
    const nomeFicheiro = `Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'}`;
    const linhasPdf = [`FATURA ${numeroFatura} - ${lojaLogada.nome_loja}`, `NUIT: ${lojaLogada.nuit} | Tel: +${lojaLogada.username} | ${lojaLogada.endereco||'Maputo'}`, `Cliente: ${nomeClienteFatura} | Tel: ${telFat} | NUIT: ${nuitFat||'-'} | Data: ${new Date().toLocaleDateString('pt-MZ')} | Status: ${isDivida?'DIVIDA':'PAGO'}`, ``, `DESCRICAO | QTD | PRECO | DESC% | SUBTOTAL`, ...produtosFat.map((p:any)=>`${p.nome} | ${p.qtd} | ${p.preco}MT | ${p.desc}% | ${(p.preco*p.qtd*(1-p.desc/100)).toFixed(0)}MT`), ``, `Subtotal: ${subtotalLiquido.toFixed(0)}MT`, `Desconto: -${descontoItens.toFixed(0)}MT`, `IVA (${ivaPerc}%): ${ivaValor.toFixed(0)}MT`, `TOTAL: ${total.toFixed(0)}MT`];
    const blobPdf = criarPdfBlob(`Fatura ${numeroFatura}`, linhasPdf);
    const urlPdf = URL.createObjectURL(blobPdf);
    const aPdf = document.createElement('a'); aPdf.href=urlPdf; aPdf.download=`${nomeFicheiro}.pdf`; document.body.appendChild(aPdf); aPdf.click(); document.body.removeChild(aPdf); setTimeout(()=>URL.revokeObjectURL(urlPdf),2000);
    // Excel - CSV
    const csvLinhas = [['Fatura','Cliente','Tel','Data','Status','Produto','Qtd','Preco','Desc%','Subtotal'], ...produtosFat.map((p:any)=>[numeroFatura, nomeClienteFatura, telFat, new Date().toLocaleDateString('pt-MZ'), isDivida?'DIVIDA':'PAGO', p.nome, p.qtd, p.preco, p.desc, (p.preco*p.qtd*(1-p.desc/100)).toFixed(0)]), ['', '', '', '', '', 'Subtotal', '', '', '', subtotalLiquido.toFixed(0)], ['', '', '', '', '', `IVA ${ivaPerc}%`, '', '', '', ivaValor.toFixed(0)], ['', '', '', '', '', 'TOTAL', '', '', '', total.toFixed(0)]];
    const csvTxt = csvLinhas.map((r:any)=>r.join(';')).join('\n');
    const blobCsv = new Blob(['\ufeff'+csvTxt], {type:'text/csv'});
    const urlCsv = URL.createObjectURL(blobCsv);
    const aCsv = document.createElement('a'); aCsv.href=urlCsv; aCsv.download=`${nomeFicheiro}.csv`; document.body.appendChild(aCsv); aCsv.click(); document.body.removeChild(aCsv); setTimeout(()=>URL.revokeObjectURL(urlCsv),2000);
    const msg = `*FATURA ${numeroFatura} - ${lojaLogada.nome_loja}* - ${isDivida?'DIVIDA':'PAGO'}\nCliente: ${nomeClienteFatura}\nTotal: ${total.toFixed(0)} MT - IVA ${ivaTipo}%`;
    const num = telFat.replace(/\D/g,''); if(num){ window.open(`https://wa.me/${num.startsWith('258')?num:`258${num}`}?text=${encodeURIComponent(msg + `\nPDF e Excel baixados: ${nomeFicheiro}.html`)}`, '_blank'); }
    alert(`✅ Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'} - Total ${total.toFixed(0)} MT - Ficheiro: Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'}`); setProdutosFat([]); setTelFat(''); setNomeFat(''); setNuitFat(''); carregarTudo(lojaLogada.conta_id);
  };

  const salvarPerfilLoja = async () => {
    const update:any = { nome_loja: perfilEdit.nomeLoja, nuit: perfilEdit.nuit, provincia: perfilEdit.provincia, cidade: perfilEdit.distrito };
    if(perfilEdit.novaPassword) update.password = perfilEdit.novaPassword;
    const { error } = await supabase.from('lojas').update(update).eq('conta_id', lojaLogada.conta_id);
    if(error) alert(error.message); else { const novaSessao = {...lojaLogada, ...update, logoData: perfilEdit.logoData, funcionarios: perfilEdit.funcionarios}; setLojaLogada(novaSessao); localStorage.setItem('loja_sessao', JSON.stringify(novaSessao)); alert('Perfil atualizado'); }
  };


  if(!lojaLogada){
    return (
      <div className="min-h-screen bg-[#1e2f4a] flex items-center justify-center p-4">
        <div className="w-full max-w-[600px] bg-[#1e2f4a] border-2 border-[#2a3f5f] rounded-[16px] p-6 shadow-2xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#8b5cf6] rounded-[12px] flex items-center justify-center mx-auto text-white font-black text-[18px]">N</div>
            <h1 className="mt-3 text-white font-black text-[18px]">Minha Loja - Porta de Entrada Negocio</h1>
            <p className="text-[8px] text-[#94a3b8] mt-1">Cadastre sua loja em 10 segundos - Depois preencha mais dados da sua loja e incorpore logotipo que vai aparecer em facturas e tudo que fizer na sua loja</p>
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={()=>setMostrarLogin('cadastro')} className={mostrarLogin==='cadastro' ? 'px-5 py-1.5 rounded-full bg-[#facc15] text-black font-black text-[10px]' : 'px-5 py-1.5 rounded-full bg-white/10 text-white text-[10px]'}>CADASTRO SIMPLES</button>
              <button onClick={()=>setMostrarLogin('login')} className={mostrarLogin==='login' ? 'px-5 py-1.5 rounded-full bg-[#facc15] text-black font-black text-[10px]' : 'px-5 py-1.5 rounded-full bg-white/10 text-white text-[10px]'}>LOGIN</button>
            </div>
          </div>
          {mostrarLogin==='cadastro' ? (
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[8px] font-bold text-white">NOME DA LOJA / EMPRESA *</label><input value={formLojaLogin.nomeLoja} onChange={e=>setFormLojaLogin({...formLojaLogin, nomeLoja:e.target.value})} placeholder="Ex: Ferragem Central Matola" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">TELEFONE / WHATSAPP *</label><input value={formLojaLogin.tel} onChange={e=>setFormLojaLogin({...formLojaLogin, tel:e.target.value})} placeholder="+258 ... " className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">PASSWORD *</label><input type="password" value={formLojaLogin.password} onChange={e=>setFormLojaLogin({...formLojaLogin, password:e.target.value})} placeholder="****" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">NUIT</label><input value={formLojaLogin.nuit} onChange={e=>setFormLojaLogin({...formLojaLogin, nuit:e.target.value})} placeholder="NUIT da loja" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div className="col-span-2"><label className="text-[8px] font-bold text-white">ENDERECO COMPLETO</label><input value={formLojaLogin.endereco} onChange={e=>setFormLojaLogin({...formLojaLogin, endereco:e.target.value})} placeholder="Av. Guerra Popular, Matola" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">PROVINCIA</label><select value={formLojaLogin.provincia} onChange={e=>setFormLojaLogin({...formLojaLogin, provincia:e.target.value})} className="w-full mt-1 h-8 border rounded px-2 text-[11px] bg-white"><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Gaza</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select></div>
                <div><label className="text-[8px] font-bold text-white">DISTRITO</label><input value={formLojaLogin.distrito} onChange={e=>setFormLojaLogin({...formLojaLogin, distrito:e.target.value})} placeholder="Distrito" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div className="col-span-2"><label className="text-[8px] font-bold text-white">RAMO DE ACTIVIDADE - Lista Selecionavel</label><select value={formLojaLogin.ramo} onChange={e=>setFormLojaLogin({...formLojaLogin, ramo:e.target.value})} className="w-full mt-1 h-8 border rounded px-2 text-[11px] bg-white"><option>Ferragem e Material de Construcao</option><option>Mercearia e Mini Mercado</option><option>Boutique</option><option>Farmacia</option><option>Restaurante</option><option>Outro</option></select></div>
                <div className="col-span-2"><label className="text-[8px] font-bold text-white">LOGOTIPO - Vai aparecer em facturas</label><button type="button" onClick={()=>{ if(!formNovoItem.nome){ alert("Escreve o nome primeiro"); return; } setFotoPreview(fotoIA(formNovoItem.nome)); setFotoFile(null); }} className="w-full mt-2 bg-[#0a3d8a] text-white py-2 rounded-full text-[11px] font-bold">🤖 Gerar foto com IA pelo nome</button><input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>setFormLojaLogin({...formLojaLogin, logoData: reader.result as any}); reader.readAsDataURL(file); }} className="w-full mt-1 border rounded px-3 py-1.5 text-[10px] bg-[#2a3f5f] text-white" />{formLojaLogin.logoData && <img src={formLojaLogin.logoData} className="w-12 h-12 mt-2 rounded border" />}</div>
              </div>
              <button onClick={criarContaLoja} className="w-full mt-4 bg-[#16a34a] text-white py-3 rounded-full text-[11px] font-black">Criar conta - 10 segundos - Entrar no negocio e Faturacao</button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div><label className="text-[8px] font-bold text-white">TELEFONE / WHATSAPP *</label><input value={formLojaLogin.tel} onChange={e=>setFormLojaLogin({...formLojaLogin, tel:e.target.value})} className="w-full mt-1 h-10 border rounded px-3 text-[12px] bg-white" placeholder="+258 ... " /></div>
              <div><label className="text-[8px] font-bold text-white">PASSWORD *</label><input type="password" value={formLojaLogin.password} onChange={e=>setFormLojaLogin({...formLojaLogin, password:e.target.value})} className="w-full mt-1 h-10 border rounded px-3 text-[12px] bg-white" placeholder="****" /></div>
              <button onClick={fazerLoginLoja} className="w-full mt-4 bg-[#facc15] text-black py-3 rounded-full text-[11px] font-black">Entrar - Login</button>
              <button onClick={()=>setMostrarLogin('cadastro')} className="w-full mt-2 bg-white/10 text-white py-2 rounded-full text-[10px]">Ainda não tem conta? Criar conta</button>
            </div>
          )}
        </div>
      </div>
    );
  }


  const filtrados = stockProdutos.filter(p=>{ if(filtroRapidoStock && !(`${p.codigo} ${p.nome}`.toLowerCase().includes(filtroRapidoStock.toLowerCase()))) return false; if(armazemAtivo!=='Todos' && p.armazem!==armazemAtivo) return false; return true; });

  const subtotalFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
  const descFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd*p.desc/100,0);
  const liqFat = subtotalFat - descFat;
  const ivaPerc = ivaTipo==='16'?16: ivaTipo==='5'?5:0;
  const ivaVal = liqFat * ivaPerc / 100;
  const totalFat = liqFat + ivaVal;

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-2 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-[10px] border p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black text-[11px]">M1</div><div><div className="font-black text-[11px]">CONTA INTERNA - {lojaLogada.provincia} - {lojaLogada.nome_loja}</div><div className="text-[7px] text-gray-500">{lojaLogada.nome_loja} - NUIT {lojaLogada.nuit} - Cidade: {lojaLogada.cidade} - {lojaLogada.ramo} - Stock: {stockProdutos.length} produtos - IVA {ivaTipo}% funcional</div></div></div>
          <div className="flex items-center gap-2"><button onClick={()=>{ localStorage.removeItem('loja_sessao'); setLojaLogada(null); setMostrarLogin('login'); }} className="bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-bold">Sair da Conta</button><div className="text-[7px] border px-2 py-1 rounded-full">{dataStockDiario} - {filtrados.length} itens</div></div>
        </div>

        <div className="bg-white rounded-[10px] border p-2 mb-3 flex gap-1 flex-wrap">
          <button onClick={()=>setNegocioTab('painel')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='painel'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>📊 Painel</button>
          <button onClick={()=>setNegocioTab('faturar')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='faturar'?'bg-yellow-400 text-black border border-black':'bg-gray-100'}`}>🧾 Faturar</button>
          <button onClick={()=>setNegocioTab('vender')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='vender'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>🛒 Vender</button>
          <button onClick={()=>setNegocioTab('stock')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='stock'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>📦 Stock</button>
          <button onClick={()=>setNegocioTab('clientes')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='clientes'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>👥 Clientes</button>
          <button onClick={()=>setNegocioTab('fornecedores')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='fornecedores'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>🚚 Fornecedores</button>
          <button onClick={()=>setNegocioTab('caixa')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='caixa'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>💰 Caixa & Turnos</button>
          <button onClick={()=>setNegocioTab('relatorios')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='relatorios'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>📈 Relatórios</button>
        </div>

        
        {negocioTab==='faturar' && (
          <div className="mt-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 bg-white border rounded-[12px] p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="font-black text-[11px] flex items-center gap-2"><span className="w-2 h-2 bg-[#facc15] rounded-full"></span> FATURAR - com logotipo</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap"><span className="bg-[#facc15] px-3 py-1 rounded-full text-[10px] font-black">Fatura Nº: {gerarNumeroFatura(caixaTurno)} (próxima)</span><span className="text-[9px] font-bold">Turno:</span>{['Manha','Tarde','Noite'].map((t:any)=>(<button key={t} onClick={()=>setCaixaTurno(t)} className={`px-2 py-1 rounded-full text-[9px] font-bold ${caixaTurno===t?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>{t==='Manha'?'TM - Manhã':t==='Tarde'?'TT - Tarde':'TN - Noite'}</button>))}<span className="text-[9px] text-gray-500">01 = nº do dia+turno • TM/TT/TN = turno • Data de hoje - reinicia amanhã</span></div>
                  <div className="flex gap-1">
                    <span className="text-[7px] border px-2 py-1 rounded-full bg-white">Formato A5</span>
                    <span className="text-[7px] bg-[#dbeafe] border border-blue-200 px-2 py-1 rounded-full">NUIT na fatura</span>
                    <span className="text-[7px] bg-[#facc15] border px-2 py-1 rounded-full text-black">58/80 - Recibo</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] p-3">
                    <div className="text-[8px] font-black text-[#92400e] uppercase">CLIENTE - TELEFONE DINAMICO WHATSAPP</div>
                    <select value={nomeFat} onChange={e=>{ const val=e.target.value; setNomeFat(val.split(' - ')[0]||''); const telMatch=val.match(/\d{9,}/); if(telMatch) setTelFat(telMatch[0]); }} className="mt-2 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white font-bold">
                      <option value="">-- Escolher cliente real ou digitar em baixo --</option>
                      {[...new Map((faturas||[]).filter((f:any)=>f.status!=='ANULADA').map((f:any)=>[`${f.cliente} - ${f.tel}`, f])).values()].map((f:any)=>(<option key={f.id} value={`${f.cliente} - ${f.tel}`}>{f.cliente} - {f.tel}</option>))}
                    </select>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[8px]">
                      <div className="bg-white border rounded-[6px] px-2 py-1.5 flex justify-between"><span className="text-gray-500">Tel dinamico:</span><b>{telFat||'+258 84 123 4567'}</b></div>
                      <div className="bg-white border rounded-[6px] px-2 py-1.5 flex justify-between"><span className="text-gray-500">NUIT:</span><b>{nuitFat||'--'}</b> <span className="ml-2 bg-[#f8fafc] border px-1 rounded">+ Detalhes</span></div>
                    </div>
                  </div>
                  <div className="bg-[#fffbeb] border-2 border-[#fde68a] rounded-[10px] p-3 flex gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-[10px] overflow-hidden">{perfilEdit.logoData ? <img src={perfilEdit.logoData} className="w-full h-full object-cover" /> : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div>
                    <div className="flex-1">
                      <div className="text-[7px] font-bold text-[#64748b] uppercase">LOJA EMISSORA - CONTA DONO - {lojaLogada?.ramo||perfilEdit.ramo||''}</div>
                      <div className="font-black text-[12px] mt-1">{lojaLogada?.nome_loja||perfilEdit.nomeLoja||''} <span className="text-[8px] bg-black text-white px-1 rounded ml-1">LOGO</span></div>
                      <div className="text-[8px] text-[#334155] mt-1">NUIT {lojaLogada?.nuit||perfilEdit.nuit||''} + Tel {lojaLogada?.username||perfilEdit.tel||''} + {lojaLogada?.cidade||perfilEdit.distrito||''}</div>
                      <div className="text-[6px] text-[#94a3b8]">{lojaLogada?.provincia||''} - {lojaLogada?.cidade||''} - Logo OK</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-[#f8fafc] border rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[9px]">Dados do comprador - ultra rapido</div><span className="text-[7px] bg-[#dcfce7] text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Rapido e ativo</span></div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div><div className="text-[7px] font-bold text-[#64748b]">TELEFONE / WHATSAPP *</div><input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="+258 84 123 4567" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                    <div><div className="text-[7px] font-bold text-[#64748b]">NOME / EMPRESA (opcional)</div><input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Micheque Mungoi" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                    <div><div className="text-[7px] font-bold text-[#64748b]">NUIT (opcional)</div><input value={nuitFat} onChange={e=>setNuitFat(e.target.value)} placeholder="NUIT da loja" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                  </div>
                </div>
                <div className="mt-3 bg-white border rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[9px]">Produtos e Servicos - do Stock - IVA no fim - Clique para adicionar ao ITENS</div><span className="text-[7px] bg-[#f8fafc] border px-2 py-0.5 rounded-full">{stockProdutos.length} produtos</span></div>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 relative"><span className="absolute left-2 top-2 text-[10px]">🔍</span><input value={buscaFat} onChange={e=>setBuscaFat(e.target.value)} placeholder="Digite 'Cimento' - busca no stock" className="w-full h-8 border rounded-full pl-7 pr-3 text-[10px] bg-[#f8fafc]" /></div>
                    <button onClick={()=>{ setBuscaProd(buscaFat); setMostrarProdutos(true); }} className="bg-[#F5B81D] text-black px-4 h-8 rounded-full text-[11px] font-black shrink-0">🛒 PRODUTOS</button>
                  </div>
                  <div className="mt-2 flex gap-1 flex-wrap">{stockProdutos.filter(p=>!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())).slice(0,8).map(p=><button key={p.id} onClick={()=>adicionarAoFaturar(p)} className="text-[7px] bg-black text-white px-2 py-1 rounded-full border"> {p.nome} - {p.precoUnit}MT - Stock:{p.stockFinalLoja} </button>)}</div>
                </div>
                <div className="mt-3 bg-[#f0fdf4] border border-green-200 rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[10px]">ITENS - {produtosFat.length} produtos no carrinho</div><button onClick={()=>setProdutosFat([])} className="text-[7px] bg-red-500 text-white px-3 py-0.5 rounded-full">Limpar</button></div>
                  <div className="mt-2 space-y-1.5">
                    {produtosFat.map((p,i)=><div key={p.id} className="grid grid-cols-12 gap-1.5 items-center bg-white border rounded-[6px] px-2 py-1.5">
                      <div className="col-span-5"><div className="font-bold text-[9px]">{p.nome}</div><div className="text-[6px] text-gray-500">{p.codigo||p.id} - Stock:{p.stockFinalLoja||'--'}</div></div>
                      <div className="col-span-2"><input type="number" value={p.qtd} onChange={e=>{ const n=[...produtosFat]; n[i].qtd=Number(e.target.value); setProdutosFat(n); }} className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-2"><input type="number" value={p.preco} onChange={e=>{ const n=[...produtosFat]; n[i].preco=Number(e.target.value); setProdutosFat(n); }} className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-2"><input type="number" value={p.desc} onChange={e=>{ const n=[...produtosFat]; n[i].desc=Number(e.target.value); setProdutosFat(n); }} placeholder="Desc%" className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-1 flex justify-center"><button onClick={()=>setProdutosFat(produtosFat.filter(x=>x.id!==p.id))} className="text-[10px]">🗑️</button></div>
                    </div>)}
                    {produtosFat.length===0 && <div className="text-center text-[9px] text-gray-400 py-3">Nenhum produto - clique nos produtos acima</div>}
                  </div>
                  <div className="mt-3 text-right text-[9px] space-y-0.5 border-t pt-2">
                    <div>Subtotal bruto: {subtotalFat.toFixed(0)} MT</div>
                    <div>Descontos: -{descFat.toFixed(0)} MT</div>
                    <div>Subtotal liquido: {liqFat.toFixed(0)} MT</div>
                    <div className="font-bold">IVA ({ivaTipo}%): {ivaVal.toFixed(0)} MT</div>
                    <div className="font-black text-[12px]">TOTAL: {totalFat.toFixed(0)} MT</div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <button onClick={()=>setIvaTipo('0')} className={`text-[7px] px-3 py-1 rounded-full border ${ivaTipo==='0'?'bg-black text-white':'bg-white'}`}>Sem IVA</button>
                    <button onClick={()=>setIvaTipo('16')} className={`text-[7px] px-3 py-1 rounded-full border ${ivaTipo==='16'?'bg-green-600 text-white':'bg-white'}`}>Com IVA 16%</button>
                    <button onClick={()=>setIvaTipo('5')} className={`text-[7px] px-3 py-1 rounded-full border ${ivaTipo==='5'?'bg-blue-600 text-white':'bg-white'}`}>Com IVA 5%</button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="flex-1 h-10 bg-[#16a34a] text-white rounded-[8px] text-[9px] font-black">Enviar via WhatsApp para {telFat||'+258 84 123 4567'} - {produtosFat.length} itens - Baixa Stock Auto - PAGO - TOTAL {totalFat.toFixed(0)} MT IVA {ivaTipo}%</button>
                    <button onClick={()=>salvarFaturaDuplaFuncao(true)} className="px-4 h-10 bg-[#facc15] border-2 border-black text-black rounded-[8px] text-[8px] font-black">DIVIDAS - FIADO - {produtosFat.length} itens</button>
                  </div>
                  <div className="mt-2 text-[6px] text-gray-500">Dupla funcao: PDF baixa automatico com nome Fatura DD-MM-AAAA - Nome - PAGO/DIVIDA + WhatsApp direto - Numero fatura por data dia de hoje</div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="bg-white border rounded-[12px] p-3 sticky top-3 shadow-sm">
                  <div className="flex justify-between"><div className="font-black text-[9px]">PRE-VISUALIZACAO A5 - Fatura - IVA {ivaTipo}% - TOTAL {totalFat.toFixed(0)} MT</div><div className="w-2 h-2 bg-[#facc15] rounded-full"></div></div>
                  <div className="mt-3 border-2 border-[#fde68a] bg-[#fffbeb] rounded-[8px] p-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-[8px] font-black overflow-hidden">{perfilEdit.logoData ? <img src={perfilEdit.logoData} className="w-full h-full object-cover" /> : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div>
                      <div>
                        <div className="text-[7px] font-bold text-[#64748b]">LOJA EMISSORA - CONTA DONO</div>
                        <div className="font-black text-[10px]">{lojaLogada?.nome_loja||perfilEdit.nomeLoja||''} <span className="text-[6px] border px-1 rounded">LOGO</span></div>
                        <div className="text-[6px]">NUIT {lojaLogada?.nuit||perfilEdit.nuit||''} + Tel {lojaLogada?.username||perfilEdit.tel||''} + {lojaLogada?.cidade||perfilEdit.distrito||''}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-[7px] space-y-1 bg-white rounded p-2 border">
                      <div className="font-bold">Fatura N {faturas.length+1}/{new Date().toLocaleDateString('pt-MZ').replace(/\//g,'-')} Cliente: {nomeFat||'--'} - {telFat}</div>
                      <div>Data: {new Date().toLocaleDateString('pt-MZ')} - NUIT: {nuitFat||'--'}</div>
                      <div className="mt-2 border-t pt-1">
                        <div className="grid grid-cols-4 font-bold"><span>Item</span><span>Qtd</span><span>Preco</span><span>Total</span></div>
                        {produtosFat.map(p=><div key={p.id} className="grid grid-cols-4"><span>{p.nome.substring(0,12)}</span><span>{p.qtd}</span><span>{p.preco}MT</span><span>{(p.preco*p.qtd).toFixed(0)}</span></div>)}
                        <div className="mt-2 font-black text-right">TOTAL: {totalFat.toFixed(0)} MT IVA {ivaTipo}%</div>
                      </div>
                    </div>
                    <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="w-full mt-3 bg-[#facc15] text-black py-1.5 rounded-full text-[7px] font-bold border">Descarregar PDF - Fatura {faturas.length+1}/{new Date().toLocaleDateString('pt-MZ').replace(/\//g,'-')} - {nomeFat||'Cliente'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {negocioTab==='stock' && (
          <div className="bg-white rounded-[10px] border p-4">
            <div className="font-black text-[11px]">TABELA COMPLETA 11 COLUNAS 06:10 FORCA DIFF - {filtrados.length} itens - Alerta abaixo 50 - STOCK DIARIO - FIFO - NEGOCIO - FIX</div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><input type="date" value={dataStockDiario} onChange={e=>setDataStockDiario(e.target.value)} className="border rounded-full px-3 py-1 text-[10px]" /><input value={filtroRapidoStock} onChange={e=>setFiltroRapidoStock(e.target.value)} placeholder="Filtro rápido" className="border rounded-full px-3 py-1 text-[9px] w-56" /><select value={armazemAtivo} onChange={e=>setArmazemAtivo(e.target.value)} className="border rounded-full px-2 py-1 text-[8px]"><option>Todos</option><option>Matola - Principal</option></select></div>
            <div className="grid grid-cols-12 gap-3 mt-4">
              <div className="col-span-2"><div className="border rounded-[10px] p-3"><button onClick={()=>setMostrarNovoItem(true)} className="w-full border rounded-full py-2 text-[10px] font-bold">+ Novo Item</button><button onClick={()=>setMostrarEntrada(true)} className="w-full mt-2 bg-yellow-100 border rounded-full py-2 text-[10px] font-bold">Entrada [F5]</button><button onClick={()=>{ setTipoSaida('saida_usa'); setMostrarSaida(true); }} className="w-full mt-2 bg-red-50 border rounded-full py-2 text-[10px] font-bold">Saída [F6]</button><button onClick={()=>{ setTipoSaida('transferencia'); setMostrarSaida(true); }} className="w-full mt-2 bg-blue-50 border rounded-full py-2 text-[10px] font-bold">Transferir Armazém → Loja</button></div></div>
              <div className="col-span-10"><div className="overflow-x-auto border rounded-[10px]"><table className="w-full text-[8px] min-w-[1100px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">ITEM/CÓDIGO</th><th className="p-2">DATA</th><th className="p-2 bg-blue-500">STOCK INICIAL ARM</th><th className="p-2 bg-blue-500">ENTRADA</th><th className="p-2 bg-blue-500">SAÍDA - Só formulário</th><th className="p-2 bg-yellow-300 text-black">STOCK FINAL ARM</th><th className="p-2 bg-green-500">STOCK INICIAL LOJA</th><th className="p-2 bg-green-500">RECEPÇÃO - Automático</th><th className="p-2 bg-green-500">VENDA - Só faturar</th><th className="p-2 bg-green-300 text-black">STOCK FINAL LOJA</th><th className="p-2 bg-yellow-300 text-black">TOTAL</th><th className="p-2">AÇÃO</th></tr></thead><tbody>{filtrados.length===0?<tr><td colSpan={12} className="p-4 text-center">Nenhum produto - Clica + Novo Item - Stock: {stockProdutos.length} total - Filtro: {filtroRapidoStock}</td></tr>:filtrados.map(p=><tr key={p.id} className="border-b"><td className="p-2"><div className="font-bold">{p.codigo}</div><div className="text-[6px]">{p.nome}</div></td><td className="p-2 text-center">{p.dataEntrada}</td><td className="p-2 text-center bg-blue-50">{p.stockInicialArmazem}</td><td className="p-2 text-center bg-blue-50">{p.entrada}</td><td className="p-2 text-center bg-blue-100 font-bold">{p.saida>0?`> ${p.saida}`:0}</td><td className="p-2 text-center font-black bg-yellow-100">{p.stockFinalArmazem}</td><td className="p-2 text-center bg-green-50">{p.stockInicialLoja}</td><td className="p-2 text-center bg-purple-100">{p.recepcao}</td><td className="p-2 text-center bg-orange-100">{p.vendaHoje}</td><td className="p-2 text-center font-black bg-green-100">{p.stockFinalLoja}</td><td className="p-2 text-center font-black bg-yellow-100">{p.stockTotal}</td><td className="p-2"><button onClick={()=>{ setProdutoSelecionado(p); setMostrarEntrada(true); }} className="bg-black text-white px-2 py-1 rounded-full text-[7px]">+ Reforçar</button></td></tr>)}</tbody></table></div></div>
            </div>
          </div>
        )}

        {negocioTab==='painel' && (
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-black text-[13px]">PAINEL DA LOJA - Perfil do proprietário - Alterar password, logo, funcionários - Mesmo stock</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div><label className="text-[10px] font-bold">NOME DA LOJA</label><input value={perfilEdit.nomeLoja} onChange={e=>setPerfilEdit({...perfilEdit, nomeLoja:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold">NUIT</label><input value={perfilEdit.nuit} onChange={e=>setPerfilEdit({...perfilEdit, nuit:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[10px] font-bold">PROVINCIA</label><input value={perfilEdit.provincia} onChange={e=>setPerfilEdit({...perfilEdit, provincia:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold">DISTRITO</label><input value={perfilEdit.distrito} onChange={e=>setPerfilEdit({...perfilEdit, distrito:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[10px] font-bold">RAMO</label><input value={perfilEdit.ramo} onChange={e=>setPerfilEdit({...perfilEdit, ramo:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold">PASSWORD ATUAL</label><input type="password" value={perfilEdit.password} onChange={e=>setPerfilEdit({...perfilEdit, password:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="••••" /></div><div><label className="text-[10px] font-bold">NOVA PASSWORD</label><input type="password" value={perfilEdit.novaPassword} onChange={e=>setPerfilEdit({...perfilEdit, novaPassword:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Nova" /></div></div>
                <div><label className="text-[10px] font-bold">LOGOTIPO - Vai aparecer em facturas</label><input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>setPerfilEdit({...perfilEdit, logoData: reader.result as any}); reader.readAsDataURL(file); }} className="w-full border rounded px-3 py-2 text-[11px] mt-1" />{perfilEdit.logoData && <img src={perfilEdit.logoData} className="w-16 h-16 mt-2 rounded border" />}</div>
                <button onClick={salvarPerfilLoja} className="w-full bg-[#1e2f4a] text-white py-2.5 rounded-full text-[12px] font-bold">Salvar Perfil - 100% Supabase</button>
              </div>
              <div className="border rounded-xl p-4"><h4 className="font-bold text-[12px]">Funcionários - 2 funcionários que vendem no caixa mas tiram do mesmo stock</h4><div className="mt-3 space-y-2"><input value={novoFunc.nome} onChange={e=>setNovoFunc({...novoFunc, nome:e.target.value})} placeholder="Nome funcionário" className="w-full border rounded px-3 py-2 text-[11px]" /><div className="grid grid-cols-2 gap-2"><input value={novoFunc.tel} onChange={e=>setNovoFunc({...novoFunc, tel:e.target.value})} placeholder="Telefone" className="border rounded px-3 py-2 text-[11px]" /><input value={novoFunc.password} onChange={e=>setNovoFunc({...novoFunc, password:e.target.value})} placeholder="Password" type="password" className="border rounded px-3 py-2 text-[11px]" /></div><select value={novoFunc.cargo} onChange={e=>setNovoFunc({...novoFunc, cargo:e.target.value})} className="w-full border rounded px-3 py-2 text-[11px]"><option>Vendedor Caixa</option><option>Gerente</option><option>Armazém</option></select><button onClick={()=>{ if(!novoFunc.nome||!novoFunc.tel) return; const lista=[...perfilEdit.funcionarios, {...novoFunc, id:Date.now()}]; setPerfilEdit({...perfilEdit, funcionarios: lista}); setNovoFunc({nome:'', tel:'', password:'', cargo:'Vendedor Caixa'}); }} className="w-full bg-[#facc15] text-black py-2 rounded-full text-[11px] font-bold">+ Adicionar Funcionário</button></div><div className="mt-4 space-y-1">{perfilEdit.funcionarios.map((f:any)=><div key={f.id} className="flex justify-between text-[11px] border-b py-1"><span>{f.nome} - {f.cargo}</span><span>{f.tel}</span></div>)}</div></div>
            </div>
          </div>
        )}

        
        {negocioTab==='faturar' && (
          <div className="mt-3 bg-white border rounded-[12px] p-4">
            <div className="font-black text-[12px]">Faturas Recentes - Anular</div>
            <div className="text-[9px] text-gray-500 mt-1">Se o cliente mudar de ideia, clica ANULAR - o stock volta e a fatura sai do Caixa, Clientes e Relatorios.</div>
            <div className="mt-2 space-y-1">
              {(faturas||[]).length===0 ? (<div className="text-[10px] text-gray-500 p-2 text-center">Nenhuma fatura ainda.</div>) : (faturas||[]).slice(0,10).map((fat:any)=>(
                <div key={fat.id} className={fat.status==='ANULADA' ? 'flex items-center justify-between border rounded px-2 py-1.5 text-[10px] bg-red-50 opacity-60' : 'flex items-center justify-between border rounded px-2 py-1.5 text-[10px]'}>
                  <div><b>{fat.numero_fatura || fat.data}</b> - {fat.cliente} - {fat.total}MT - {fat.status} - {String(fat.data).slice(0,10)}</div>
                  <div className="flex gap-1">
                    {fat.status!=='ANULADA' ? (<button onClick={()=>anularFatura(fat)} className="px-2 py-1 bg-red-600 text-white rounded-full text-[9px] font-bold">ANULAR - Voltar Stock</button>) : (<span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[9px] font-bold">ANULADA</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {negocioTab==='vender' && (
          <div className="mt-3">
            <div className="bg-white border rounded-[12px] p-4">
              <div className="font-black text-[12px]">VENDER - Venda Rapida - Ligado ao Stock e Faturar</div>
              <div className="text-[8px] text-[#64748b] mt-1">Mesmo carrinho que Faturar - Quando vender aqui, baixa stock automatico - VERCEL EXACTO</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border rounded-[10px] p-3">
                  <div className="font-bold text-[10px]">Carrinho atual - {produtosFat.length} itens</div>
                  <div className="mt-2 space-y-1.5">
                    {produtosFat.map((p:any)=><div key={p.id} className="flex justify-between border-b pb-1 text-[10px]"><span>{p.nome} - CIMPOR v3</span><span className="font-bold">{(p.preco*p.qtd).toFixed(0)} MT</span></div>)}
                    {produtosFat.length===0 && <div className="text-[10px] text-gray-400 py-2">Saco de Cimento 50kg - CIMPOR v3 - 2550 MT<br/>Bloco 15cm - 40x20 x20 - 840 MT<br/><span className="text-[8px]">Adiciona no Faturar ou no Stock para aparecer aqui - mesmo carrinho</span></div>}
                  </div>
                  <div className="mt-3 flex gap-1 flex-wrap">{stockProdutos.slice(0,4).map(p=><button key={p.id} onClick={()=>adicionarAoFaturar(p)} className="text-[8px] bg-black text-white px-2 py-1 rounded-full">{p.nome} - {p.precoUnit}MT</button>)}</div>
                </div>
                <div className="bg-[#f0fdf4] border border-green-200 rounded-[10px] p-4">
                  <div className="font-bold text-[10px]">Finalizar venda</div>
                  <div className="text-[8px] text-gray-500 mt-1">Cliente Balcao - tel: +258 84 123 4567</div>
                  <div className="mt-2"><div className="text-[8px] font-bold">TELEFONE / CLIENTE</div><input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="+258 84 123 4567" className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white" /></div>
                  <div className="mt-2"><div className="text-[8px] font-bold">NOME / EMPRESA</div><input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Nome do cliente" className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white" /></div>
                  <div className="font-black text-[14px] mt-3">TOTAL: {totalFat.toFixed(0)} MT</div>
                  <div className="text-[8px] text-gray-500">IVA {ivaTipo}% incluido - Subtotal {liqFat.toFixed(0)} + IVA {ivaVal.toFixed(0)}</div>
                  <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="w-full mt-3 bg-[#16a34a] text-white py-2.5 rounded-[8px] text-[10px] font-black">Confirmar venda - Baixar stock</button>
                  <button onClick={()=>salvarFaturaDuplaFuncao(true)} className="w-full mt-2 bg-[#facc15] border-2 border-black text-black py-2 rounded-[8px] text-[9px] font-black">DIVIDA - FIADO - Baixar stock</button>
                </div>
              </div>
            </div>
          </div>
        )}
                {negocioTab==='relatorios' && (() => {
          // RELATORIO REAL - construído de Faturas + Stock (não mock)
          // Cada linha = 1 produto dentro de 1 fatura
          const linhas: any[] = []; const faturasValidas = (faturas||[]).filter((f:any)=> f.status!=='ANULADA');
          faturasValidas.forEach((fat:any)=>{
            const prods = Array.isArray(fat.produtos) ? fat.produtos : [];
            const dataFat = fat.data ? String(fat.data).slice(0,10) : (fat.created_at ? String(fat.created_at).slice(0,10) : dataStockDiario);
            prods.forEach((it:any)=>{
              const nomeProd = it.nome || it.nome_produto || 'Produto';
              const prodStock = (stockProdutos||[]).find((s:any)=> s.nome===nomeProd || s.codigo===it.codigo);
              const qtd = Number(it.qtd || it.quantidade || 1);
              const preco = Number(it.preco || it.precoUnit || prodStock?.precoUnit || 0);
              const valor = qtd * preco;
              linhas.push({
                data: dataFat,
                nome: nomeProd,
                grupo: prodStock?.cat || it.cat || 'Geral',
                stInicial: prodStock ? Number(prodStock.stockInicialLoja||0) : 0,
                recepcao: prodStock ? Number(prodStock.recepcao||0) : 0,
                vendas: prodStock ? Number(prodStock.vendaHoje||0) : qtd,
                cliente: fat.cliente || fat.tel || '-',
                quanti: qtd,
                valor,
                valorDivida: fat.is_divida ? valor : 0,
                total: valor,
              });
            });
          });
          // Se não há faturas, mostra 1 linha por produto do Stock (sem vendas) para não ficar vazio com mock
          const linhasFiltradas = linhas.filter((r:any)=>{
            if(relFiltroProduto!=='Todos' && r.nome!==relFiltroProduto) return false;
            if(relFiltroGrupo!=='Todos' && r.grupo!==relFiltroGrupo) return false;
            if(relDataInicio && r.data < relDataInicio) return false;
            if(relDataFim && r.data > relDataFim) return false;
            return true;
          });
          const totSt = linhasFiltradas.reduce((s:any,r:any)=>s+r.stInicial,0);
          const totRec = linhasFiltradas.reduce((s:any,r:any)=>s+r.recepcao,0);
          const totVendas = linhasFiltradas.reduce((s:any,r:any)=>s+r.vendas,0);
          const totQtd = linhasFiltradas.reduce((s:any,r:any)=>s+r.quanti,0);
          const totDivida = linhasFiltradas.reduce((s:any,r:any)=>s+r.valorDivida,0);
          const totTotal = linhasFiltradas.reduce((s:any,r:any)=>s+r.total,0);
          const produtosUnicos = [...new Set((stockProdutos||[]).map((p:any)=>p.nome))];
          const gruposUnicos = [...new Set((stockProdutos||[]).map((p:any)=>p.cat || 'Geral'))];
          const gerarPDF = () => {
            const linhasTxt = linhasFiltradas.map((r:any)=> `${r.data} | ${r.nome} | ST ${r.stInicial} | REC ${r.recepcao} | VENDAS ${r.vendas} | ${r.cliente} | QTD ${r.quanti} | ${r.valor}MT | DIVIDA ${r.valorDivida}MT | TOTAL ${r.total}MT`).join('\n');
            const conteudo = `RELATORIO - ${lojaLogada?.nome_loja || ''}\nDATA: ${relDataInicio||'...'} a ${relDataFim||'...'}\nPRODUTO: ${relFiltroProduto} | GRUPO: ${relFiltroGrupo}\n\n${linhasTxt}\n\nTOTAIS: ST ${totSt} REC ${totRec} VENDAS ${totVendas} QTD ${totQtd} DIVIDA ${totDivida}MT TOTAL ${totTotal}MT`;
            const nomeRel = `Relatorio-${relDataInicio||'inicio'}-a-${relDataFim||'fim'}`;
            // PDF - HTML download automatico, sem Save
            const htmlRel = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${nomeRel}</title><style>body{font-family:Arial;padding:20px;font-size:11px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;font-size:10px}th{background:#1e2f4a;color:#fff}</style></head><body><h2>RELATORIO - ${lojaLogada?.nome_loja||''}</h2><p>DATA: ${relDataInicio||'...'} a ${relDataFim||'...'} | PRODUTO: ${relFiltroProduto} | GRUPO: ${relFiltroGrupo}</p><table><thead><tr><th>DATA</th><th>PRODUTO</th><th>ST INICIAL</th><th>RECEPCAO</th><th>VENDAS</th><th>CLIENTE</th><th>QTD</th><th>VALOR</th><th>DIVIDA</th><th>TOTAL</th></tr></thead><tbody>${linhasFiltradas.map((r:any)=>`<tr><td>${r.data}</td><td>${r.nome}</td><td>${r.stInicial}</td><td>${r.recepcao}</td><td>${r.vendas}</td><td>${r.cliente}</td><td>${r.quanti}</td><td>${r.valor}MT</td><td>${r.valorDivida}MT</td><td>${r.total}MT</td></tr>`).join('')}</tbody></table><h3>TOTAIS: ST ${totSt} REC ${totRec} VENDAS ${totVendas} QTD ${totQtd} DIVIDA ${totDivida}MT TOTAL ${totTotal}MT</h3></body></html>`;
            const linhasPdfRel = [`RELATORIO - ${lojaLogada?.nome_loja||''}`, `DATA: ${relDataInicio||'...'} a ${relDataFim||'...'} | PRODUTO: ${relFiltroProduto} | GRUPO: ${relFiltroGrupo}`, ``, ...linhasFiltradas.map((r:any)=>`${r.data} | ${r.nome} | ST ${r.stInicial} | REC ${r.recepcao} | VENDAS ${r.vendas} | ${r.cliente} | QTD ${r.quanti} | ${r.valor}MT | DIVIDA ${r.valorDivida}MT | TOTAL ${r.total}MT`), ``, `TOTAIS: ST ${totSt} REC ${totRec} VENDAS ${totVendas} QTD ${totQtd} DIVIDA ${totDivida}MT TOTAL ${totTotal}MT`];
            const bPdf = criarPdfBlob(`Relatorio ${nomeRel}`, linhasPdfRel); const uPdf = URL.createObjectURL(bPdf); const aPdf = document.createElement('a'); aPdf.href=uPdf; aPdf.download=`${nomeRel}.pdf`; document.body.appendChild(aPdf); aPdf.click(); document.body.removeChild(aPdf); setTimeout(()=>URL.revokeObjectURL(uPdf),2000);
            // Excel - CSV
            const csvRel = [['DATA','PRODUTO','ST INICIAL','RECEPCAO','VENDAS','CLIENTE','QTD','VALOR','DIVIDA','TOTAL'], ...linhasFiltradas.map((r:any)=>[r.data, r.nome, r.stInicial, r.recepcao, r.vendas, r.cliente, r.quanti, r.valor, r.valorDivida, r.total]), ['TOTAIS','', totSt, totRec, totVendas, '', totQtd, '', totDivida, totTotal]];
            const csvTxtRel = csvRel.map((r:any)=>r.join(';')).join('\n');
            const bCsv = new Blob(['\ufeff'+csvTxtRel], {type:'text/csv'}); const uCsv = URL.createObjectURL(bCsv); const aCsv = document.createElement('a'); aCsv.href=uCsv; aCsv.download=`${nomeRel}.csv`; document.body.appendChild(aCsv); aCsv.click(); document.body.removeChild(aCsv); setTimeout(()=>URL.revokeObjectURL(uCsv),2000);
            // WhatsApp no mesmo clique
            const textoW = `RELATORIO ${lojaLogada?.nome_loja||''} - ${relDataInicio||'...'} a ${relDataFim||'...'} - ${linhasFiltradas.length} linhas - TOTAL ${totTotal}MT - DIVIDA ${totDivida}MT - PDF e Excel baixados!`;
            window.open(`https://wa.me/${String(lojaLogada?.username||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(textoW)}`, '_blank');
          };
          const enviarWhats = () => {
            const texto = `RELATORIO ${lojaLogada?.nome_loja||''} - ${relDataInicio||'...'} a ${relDataFim||'...'} - ${linhasFiltradas.length} linhas - TOTAL ${totTotal}MT - DIVIDA ${totDivida}MT`;
            window.open(`https://wa.me/${String(lojaLogada?.username||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(texto)}`, '_blank');
          };
          return (
          <div className="mt-3 space-y-3">
            <div className="bg-white border rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-1"><span className="text-[14px]">📊</span><span className="font-black text-[12px]">RELATORIO SIMPLES - Por Produto / Dia - REAL (Stock + Faturas)</span></div>
              <div className="text-[8px] text-[#64748b] mb-3">Tabela REAL: cada linha = 1 produto de 1 fatura. ST INICIAL e RECEPCAO vêm do Stock. CLIENTE, QUANTI, VALOR, DIVIDA vêm das Faturas. Sem mock.</div>
              <div className="grid grid-cols-4 gap-3">
                <div><div className="text-[8px] font-bold">PRODUTO</div><select value={relFiltroProduto} onChange={e=>setRelFiltroProduto(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white"><option>Todos</option>{produtosUnicos.map((n:any)=><option key={n}>{n}</option>)}</select></div>
                <div><div className="text-[8px] font-bold">GRUPO</div><select value={relFiltroGrupo} onChange={e=>setRelFiltroGrupo(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white"><option>Todos</option>{gruposUnicos.map((g:any)=><option key={g}>{g}</option>)}</select></div>
                <div><div className="text-[8px] font-bold">DATA INICIO</div><input type="date" value={relDataInicio} onChange={e=>setRelDataInicio(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px]" /></div>
                <div><div className="text-[8px] font-bold">DATA FIM</div><input type="date" value={relDataFim} onChange={e=>setRelDataFim(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px]" /></div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={()=>{ setRelAplicado(true); carregarTudo(lojaLogada.conta_id); }} className="px-4 h-8 bg-[#facc15] text-black border-2 border-black rounded-full text-[9px] font-black">🔍 SEARCH / REFRESH - FILTRAR TABELA POR DATA</button>
                <button onClick={()=>{ setRelFiltroProduto('Todos'); setRelFiltroGrupo('Todos'); setRelDataInicio(''); setRelDataFim(''); setRelAplicado(false); }} className="px-4 h-8 bg-white border-2 border-black text-black rounded-full text-[9px] font-black">LIMPAR FILTRO</button>
                <button onClick={gerarPDF} className="px-4 h-8 bg-[#1e2f4a] text-white rounded-full text-[9px] font-black">GERAR RELATORIO - PDF COM DIVIDAS + FILTRO DATA</button>
                <button onClick={enviarWhats} className="px-4 h-8 bg-[#16a34a] text-white rounded-full text-[9px] font-black">ENVIAR WHATSAPP</button>
              </div>
              <div className="text-[9px] text-gray-500 mt-2">Stock: {stockProdutos.length} produtos reais | Faturas: {faturas.length} reais | Linhas: {linhasFiltradas.length} {relAplicado ? '(filtro aplicado)' : ''}</div>
            </div>
            <div className="bg-white border rounded-[12px] p-4">
              <div className="font-black text-[11px] mb-3">TABELA - DATA | PRODUTO | ST INICIAL | RECEPCAO | VENDAS | CLIENTE | QUANTI | VALOR | TOTAL - REAL</div>
              <div className="overflow-x-auto border rounded-[8px]">
                <table className="w-full text-[9px] min-w-[1100px]">
                  <thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">DATA</th><th className="p-2 text-left">NOME PRODUTO</th><th className="p-2 text-center">ST INICIAL</th><th className="p-2 text-center">RECEPCAO</th><th className="p-2 text-center">VENDAS</th><th className="p-2 text-left">CLIENTE</th><th className="p-2 text-center">QUANTI</th><th className="p-2 text-center">VALOR</th><th className="p-2 text-center bg-blue-600">VALOR DIVIDA</th><th className="p-2 text-center bg-yellow-400 text-black">TOTAL C/DIVIDAS</th></tr></thead>
                  <tbody>
                    {linhasFiltradas.length===0 ? (
                      <tr><td colSpan={10} className="p-4 text-center">Nenhuma venda com este filtro - Stock tem {stockProdutos.length} produto(s) reais: {(stockProdutos||[]).map((p:any)=>p.nome).join(', ') || 'nenhum'} - Faturas: {faturas.length} - Limpa o filtro para ver tudo.</td></tr>
                    ) : linhasFiltradas.map((r:any,idx:number)=>(
                      <tr key={idx} className="border-b"><td className="p-2">{r.data}</td><td className="p-2 font-bold">{r.nome}</td><td className="p-2 text-center bg-blue-50">{r.stInicial}</td><td className="p-2 text-center">{r.recepcao}</td><td className="p-2 text-center font-bold">{r.vendas}</td><td className="p-2">{r.cliente}</td><td className="p-2 text-center font-bold">{r.quanti}</td><td className="p-2 text-center">{r.valor}MT</td><td className="p-2 text-center bg-blue-100">{r.valorDivida}MT</td><td className="p-2 text-center bg-yellow-100 font-bold">{r.total}MT</td></tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="bg-[#facc15] font-black text-[9px]"><td className="p-2" colSpan={2}>TOTAIS GERAIS REAIS: ST {totSt} REC {totRec} VENDAS {totVendas}</td><td className="p-2 text-center">{totSt}</td><td className="p-2 text-center">{totRec}</td><td className="p-2 text-center">{totVendas}</td><td className="p-2"></td><td className="p-2 text-center">{totQtd}</td><td className="p-2"></td><td className="p-2 text-center bg-blue-200">{totDivida}MT</td><td className="p-2 text-center bg-yellow-300">{totTotal}MT</td></tr></tfoot>
                </table>
              </div>
            </div>
          </div>
          );
        })()}
        {(negocioTab==='clientes' || negocioTab==='fornecedores' || negocioTab==='caixa') && (() => {
 const clientesMap:any={}; (faturas||[]).filter((f:any)=>f.status!=='ANULADA').forEach((fat:any)=>{ const chave=(fat.cliente||fat.tel||'Sem nome')+'|'+(fat.tel||''); if(!clientesMap[chave]) clientesMap[chave]={nome:fat.cliente||'Sem nome',tel:fat.tel||'-',nuit:fat.nuit||'-',qtdFaturas:0,totalCompras:0,totalDivida:0,ultimaData:fat.data||fat.created_at||''}; clientesMap[chave].qtdFaturas+=1; clientesMap[chave].totalCompras+=Number(fat.total||0); if(fat.is_divida) clientesMap[chave].totalDivida+=Number(fat.total||0); }); const clientes=Object.values(clientesMap); const totalDividaClientes=(clientes as any[]).reduce((s:any,c:any)=>s+Number(c.totalDivida||0),0); const hoje=new Date().toISOString().slice(0,10); const faturasHoje=(faturas||[]).filter((f:any)=>f.status!=='ANULADA').filter((f:any)=>String(f.data||f.created_at||'').slice(0,10)===hoje); const caixaHojePago=faturasHoje.filter((f:any)=>!f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaHojeDivida=faturasHoje.filter((f:any)=>f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaTotalPago=(faturas||[]).filter((f:any)=>f.status!=='ANULADA').filter((f:any)=>!f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaTotalDivida=(faturas||[]).filter((f:any)=>f.status!=='ANULADA').filter((f:any)=>f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaTotal=caixaTotalPago+caixaTotalDivida;
 const salvarForn=()=>{ if(!formForn.nome||!formForn.tel){ alert('Nome e Telefone'); return; } const novo={...formForn,id:Date.now()}; const lista=[...fornecedores,novo]; setFornecedores(lista); localStorage.setItem(`loja_fornecedores_${lojaLogada?.conta_id||'geral'}`,JSON.stringify(lista)); setFormForn({nome:'',tel:'',produto:'',nota:''}); };
 return (<div className="mt-3 space-y-3">{negocioTab==='clientes' && (<div className="bg-white border rounded-[12px] p-4"><div className="font-black text-[13px]">CLIENTES - Reais das Faturas</div><div className="text-[9px] text-gray-500 mt-1">{clientes.length} cliente(s) - {faturas.length} fatura(s) - Divida total {totalDividaClientes}MT</div><div className="mt-3 overflow-x-auto border rounded-[8px]"><table className="w-full text-[10px] min-w-[700px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">CLIENTE</th><th className="p-2 text-left">TELEFONE</th><th className="p-2 text-left">NUIT</th><th className="p-2 text-center">FATURAS</th><th className="p-2 text-center">TOTAL COMPRAS</th><th className="p-2 text-center bg-blue-600">DIVIDA</th><th className="p-2 text-center">ULTIMA COMPRA</th><th className="p-2 text-center">ACAO</th></tr></thead><tbody>{clientes.length===0 ? (<tr><td colSpan={8} className="p-4 text-center">Nenhum cliente ainda - Faz a primeira venda em Faturar / Vender e o cliente aparece aqui automaticamente.</td></tr>) : (clientes as any[]).map((c:any,i:number)=>(<tr key={i} className="border-b"><td className="p-2 font-bold">{c.nome}</td><td className="p-2">{c.tel}</td><td className="p-2">{c.nuit}</td><td className="p-2 text-center">{c.qtdFaturas}</td><td className="p-2 text-center font-bold">{c.totalCompras}MT</td><td className="p-2 text-center bg-blue-50 font-bold">{c.totalDivida}MT</td><td className="p-2 text-center">{String(c.ultimaData).slice(0,10)}</td><td className="p-2 text-center"><button onClick={()=>window.open(`https://wa.me/${String(c.tel||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Ola ${c.nome}, a sua divida e ${c.totalDivida}MT.`)}`,'_blank')} className="px-2 py-1 bg-[#16a34a] text-white rounded-full text-[9px] font-bold">WhatsApp</button></td></tr>))}</tbody></table></div></div>)}{negocioTab==='fornecedores' && (<div className="bg-white border rounded-[12px] p-4"><div className="font-black text-[13px]">FORNECEDORES - Quem fornece o teu Stock</div><div className="text-[9px] text-gray-500 mt-1">{fornecedores.length} fornecedor(es) - Stock tem {stockProdutos.length} produto(s)</div><div className="mt-3 grid grid-cols-4 gap-2"><input value={formForn.nome} onChange={e=>setFormForn({...formForn,nome:e.target.value})} placeholder="Nome fornecedor *" className="border rounded px-3 py-2 text-[11px]" /><input value={formForn.tel} onChange={e=>setFormForn({...formForn,tel:e.target.value})} placeholder="Telefone *" className="border rounded px-3 py-2 text-[11px]" /><input value={formForn.produto} onChange={e=>setFormForn({...formForn,produto:e.target.value})} placeholder="Produto - ex: Cimento" className="border rounded px-3 py-2 text-[11px]" /><button onClick={salvarForn} className="bg-[#1e2f4a] text-white rounded px-3 py-2 text-[11px] font-bold">+ Adicionar</button></div><div className="mt-3 overflow-x-auto border rounded-[8px]"><table className="w-full text-[10px] min-w-[700px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">FORNECEDOR</th><th className="p-2 text-left">TELEFONE</th><th className="p-2 text-left">PRODUTO</th><th className="p-2 text-center">ACAO</th></tr></thead><tbody>{fornecedores.length===0 ? (<tr><td colSpan={4} className="p-4 text-center">Nenhum fornecedor ainda - Adiciona em cima. Produtos no Stock: {(stockProdutos||[]).map((p:any)=>p.nome).join(', ') || 'nenhum'}.</td></tr>) : fornecedores.map((f:any)=>(<tr key={f.id} className="border-b"><td className="p-2 font-bold">{f.nome}</td><td className="p-2">{f.tel}</td><td className="p-2">{f.produto}</td><td className="p-2 text-center"><button onClick={()=>window.open(`https://wa.me/${String(f.tel||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Ola ${f.nome}, preciso de ${f.produto}.`)}`,'_blank')} className="px-2 py-1 bg-[#16a34a] text-white rounded-full text-[9px] font-bold">WhatsApp</button></td></tr>))}</tbody></table></div></div>)}{negocioTab==='caixa' && (<div className="bg-white border rounded-[12px] p-4"><div className="flex items-center justify-between"><div><div className="font-black text-[13px]">CAIXA & TURNOS - Dinheiro Real das Faturas</div><div className="text-[9px] text-gray-500 mt-1">Turno: {caixaTurno} - Hoje: {hoje}</div></div><div className="flex gap-1">{['Manha','Tarde','Noite'].map((t:any)=>(<button key={t} onClick={()=>setCaixaTurno(t)} className={`px-3 py-1 rounded-full text-[10px] font-bold ${caixaTurno===t?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>{t}</button>))}</div></div><div className="mt-3 grid grid-cols-4 gap-2"><div className="bg-green-50 border border-green-200 rounded p-3 text-center"><div className="text-[9px] font-bold text-green-700">CAIXA HOJE - PAGO</div><div className="font-black text-[16px] text-green-700 mt-1">{caixaHojePago}MT</div></div><div className="bg-blue-50 border border-blue-200 rounded p-3 text-center"><div className="text-[9px] font-bold text-blue-700">HOJE - FIADO</div><div className="font-black text-[16px] text-blue-700 mt-1">{caixaHojeDivida}MT</div></div><div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-center"><div className="text-[9px] font-bold">TOTAL GERAL - PAGO</div><div className="font-black text-[16px] mt-1">{caixaTotalPago}MT</div></div><div className="bg-red-50 border border-red-200 rounded p-3 text-center"><div className="text-[9px] font-bold text-red-700">TOTAL DIVIDA A RECEBER</div><div className="font-black text-[16px] text-red-700 mt-1">{caixaTotalDivida}MT</div></div></div><div className="mt-3 border rounded-[8px] p-3"><div className="font-bold text-[11px]">Fecho de Caixa - Turno {caixaTurno}</div><div className="text-[10px] text-gray-600 mt-1">Caixa total = {caixaTotal}MT - Stock {stockProdutos.length} produto(s) - Faturas {faturas.length}</div><button onClick={()=>alert(`Fecho ${caixaTurno} - Hoje Pago ${caixaHojePago}MT + Fiado ${caixaHojeDivida}MT = ${caixaHojePago+caixaHojeDivida}MT`)} className="mt-2 px-4 py-2 bg-[#1e2f4a] text-white rounded-full text-[10px] font-bold">Fechar Turno {caixaTurno}</button></div></div>)}</div>); })()}
{negocioTab==='stock' && (<div className="bg-[#0a3d8a] text-white rounded-xl p-4 mt-3"><div className="font-bold text-[13px]">🤖 Preencher Stock com IA - por ramo de atividade</div><div className="text-[10px] opacity-90 mt-1">A IA percebe o ramo e cria no mínimo 100 produtos reais na tua tabela produtos_loja, com 10 no armazém + 10 na loja para começar. Depois editas preço, stock e foto.</div><div className="flex gap-2 mt-2"><select value={ramoIA} onChange={e=>setRamoIA(e.target.value)} className="flex-1 rounded-full px-3 py-2 text-[12px] text-black"><option>Ferragem</option><option>Mercearia</option><option>Farmácia</option><option>Loja de Roupa</option><option>Material Elétrico</option></select><button disabled={aPreencherIA} onClick={preencherStockIA} className="bg-[#F5B81D] text-black px-4 py-2 rounded-full text-[11px] font-bold">{aPreencherIA?'A preencher...':'Preencher 100 produtos'}</button></div><div className="flex gap-2 mt-2"><button onClick={gerarFotosIATodos} className="flex-1 bg-white text-black px-3 py-2 rounded-full text-[11px] font-bold">🖼️ Gerar fotos IA para produtos sem foto</button></div><div className="text-[9px] opacity-80 mt-1">A IA cria foto ao preencher (ex: Cimento → foto de saco de cimento). Depois podes tirar foto real e substituir.</div><div className="text-[9px] opacity-80 mt-1">Ex: Ferragem → Cimento, Varão 6mm, Varão 8mm, Arame, Pregos, Tubos... • Não duplica nomes que já existem.</div></div>)}
        {mostrarNovoItem && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-md p-5"><h3 className="font-bold text-[13px]">+ Novo Item - Só iniciais</h3><div className="mt-3 border-2 border-dashed rounded-xl p-3 text-center"><label className="block text-[11px] font-bold">📷 Foto do produto - tira foto real ou escolhe da galeria</label>{fotoPreview ? (<img src={fotoPreview} className="w-full h-[140px] object-cover rounded-lg mt-2" />) : (<div className="text-[30px] mt-1">📷</div>)}<input type="file" accept="image/*" capture="environment" onChange={e=>{ const f=(e.target as any).files?.[0]; if(!f) return; setFotoFile(f); setFotoPreview(URL.createObjectURL(f)); }} className="w-full mt-2 text-[11px]" /><div className="text-[9px] text-gray-500">A foto aparece no cartão da Tela PRODUTOS. Sem foto, fica o emoji.</div></div><div className="grid grid-cols-2 gap-2 mt-3"><input value={formNovoItem.codigo} onChange={e=>setFormNovoItem({...formNovoItem, codigo:e.target.value})} placeholder="COD" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.nome} onChange={e=>setFormNovoItem({...formNovoItem, nome:e.target.value})} placeholder="Nome" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.preco} onChange={e=>setFormNovoItem({...formNovoItem, preco:e.target.value})} placeholder="Preço" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.stockInicialArmazem} onChange={e=>setFormNovoItem({...formNovoItem, stockInicialArmazem:e.target.value})} placeholder="Stock Inicial Arm" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.stockInicialLoja} onChange={e=>setFormNovoItem({...formNovoItem, stockInicialLoja:e.target.value})} placeholder="Stock Inicial Loja" className="border rounded px-2 py-2 text-[11px]" /></div><div className="flex gap-2 mt-4"><button onClick={()=>setMostrarNovoItem(false)} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={salvarNovoItemReal} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Criar</button></div></div></div>)}
        {mostrarEntrada && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5"><h3 className="font-bold text-[13px]">Entrada [F5]</h3><input value={qtdEntrada} onChange={e=>setQtdEntrada(e.target.value)} placeholder="Quantidade" className="w-full border rounded px-3 py-2 text-[13px] mt-3" type="number" /><div className="flex gap-2 mt-4"><button onClick={()=>{ setMostrarEntrada(false); setProdutoSelecionado(null); setQtdEntrada(''); }} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={fazerEntradaReal} className="flex-1 bg-yellow-400 text-black py-2 rounded-full text-[11px] font-bold">Confirmar</button></div></div></div>)}
        {mostrarSaida && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5"><h3 className="font-bold text-[13px]">Saída - {tipoSaida}</h3><div className="flex gap-1 mt-2"><button onClick={()=>setTipoSaida('saida_usa')} className={`flex-1 py-1.5 rounded-full text-[9px] ${tipoSaida==='saida_usa'?'bg-red-500 text-white':'bg-gray-100'}`}>Saída USA</button><button onClick={()=>setTipoSaida('transferencia')} className={`flex-1 py-1.5 rounded-full text-[9px] ${tipoSaida==='transferencia'?'bg-blue-500 text-white':'bg-gray-100'}`}>Transferência Armazém→Loja</button></div><input value={qtdSaida} onChange={e=>setQtdSaida(e.target.value)} placeholder="Quantidade" className="w-full border rounded px-3 py-2 text-[13px] mt-3" type="number" /><div className="flex gap-2 mt-4"><button onClick={()=>{ setMostrarSaida(false); setProdutoSelecionado(null); setQtdSaida(''); }} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={fazerSaidaReal} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Confirmar</button></div></div></div>)}
        {/* TELA PRODUTOS - REAL: lê stockProdutos (produtos_loja, conta_id da loja). Sem mock. Adicionar usa adicionarAoFaturar - enche ITENS da fatura ao mesmo tempo. */}
        {mostrarProdutos && (<div className="fixed inset-0 bg-black/60 z-[60] flex flex-col"><div className="bg-[#0a3d8a] text-white p-3"><div className="flex gap-2 items-center"><button onClick={()=>setMostrarProdutos(false)} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px] font-bold">← Voltar à fatura</button><b className="flex-1 text-center text-[13px]">Escolhe os produtos - Stock real</b><span className="text-[10px]">{stockProdutos.length} produtos reais</span></div><div className="flex gap-2 mt-2"><input value={buscaProd} onChange={e=>setBuscaProd(e.target.value)} placeholder="🔍 Procurar no stock real... ex: cimento" className="flex-1 rounded-full px-3 py-2 text-[12px] text-black" /><button onClick={()=>{ setMostrarProdutos(false); setNegocioTab('stock'); setMostrarNovoItem(true); }} className="bg-green-600 text-white px-3 py-2 rounded-full text-[11px] font-bold">+ Novo produto</button></div><div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">{catsReais.map((c:string)=>(<button key={c} onClick={()=>setCatProd(c)} className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 ${catProd===c?'bg-[#F5B81D] text-black':'bg-white/20 text-white'}`}>{c}</button>))}</div></div><div className="flex-1 overflow-y-auto p-3 bg-[#eef1f4]"><p className="text-[11px] text-gray-600 mb-2">Os produtos já estão a entrar na fatura. Stock da loja: stockFinalLoja. Se stock 0, fica Esgotado.</p>{stockProdutos.length===0 && (<div className="bg-white rounded-xl p-4 text-center text-[12px]">Sem produtos no stock desta conta. Vai a Stock → + Novo Item e cria o primeiro. Nada de mock aqui.</div>)}<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{stockProdutos.filter((pr:any)=>(catProd==='Todos'||(pr.cat||'Outros')===catProd)&&(!buscaProd||String(pr.nome||'').toLowerCase().includes(buscaProd.toLowerCase())||String(pr.codigo||'').toLowerCase().includes(buscaProd.toLowerCase()))).map((pr:any)=>{ const noCarrinho=produtosFat.find((x:any)=>x.id===pr.id); const qtd=noCarrinho?.qtd||0; const stockLoja=pr.stockFinalLoja??0; const esg=stockLoja<=0; return (<div key={pr.id} className={`bg-white rounded-xl border overflow-hidden ${esg?'opacity-60':''}`}><div className="h-[110px] flex items-center justify-center text-[52px] bg-[#fef3c7] overflow-hidden">{pr.foto_url ? (<img src={pr.foto_url} className="w-full h-full object-cover" />) : emojiProd(pr)}</div><div className="p-2"><div className="font-bold text-[12px] leading-tight">{pr.nome}</div><div className="text-[10px] text-gray-500">{pr.codigo||''} • {pr.cat||'Outros'} • {pr.marca||''}</div><div className="font-black text-[15px] mt-1">{pr.precoUnit} MT</div><div className="text-[10px] text-gray-600">Stock loja: {stockLoja} {esg?'• Esgotado':''}</div>{esg?(<button disabled className="w-full mt-2 bg-gray-200 py-2.5 rounded-full text-[11px] font-bold">Esgotado</button>):qtd===0?(<button onClick={()=>adicionarAoFaturar(pr)} className="w-full mt-2 bg-green-600 text-white py-2.5 rounded-full text-[11px] font-bold">+ ADICIONAR</button>):(<div className="flex gap-1 items-center justify-center mt-2"><button onClick={()=>tirarDoFaturar(pr)} className="w-9 h-9 rounded-full border text-[16px] font-bold">-</button><b className="text-[13px]">{qtd}</b><button onClick={()=>adicionarAoFaturar(pr)} className="w-9 h-9 rounded-full bg-green-600 text-white text-[16px] font-bold">+</button></div>)}</div></div>); })}</div></div><div className="bg-white border-t p-3"><div className="flex justify-between items-center"><b className="text-[13px]">CESTO: {produtosFat.reduce((s:any,x:any)=>s+(x.qtd||0),0)} itens — {produtosFat.reduce((s:any,x:any)=>s+(x.qtd||0)*(x.preco||0),0)} MT</b><span className="text-[10px] text-gray-500">Já na fatura</span></div><div className="text-[11px] text-gray-600 mt-1">{produtosFat.map((x:any)=>`${x.nome} x${x.qtd}`).join(' • ')||'Cesto vazio'}</div><div className="flex gap-2 mt-2"><button onClick={()=>{ setMostrarProdutos(false); setNegocioTab('stock'); setMostrarNovoItem(true); }} className="bg-gray-100 px-4 py-3 rounded-full text-[11px] font-bold">+ Novo produto</button><button onClick={()=>setMostrarProdutos(false)} className="flex-1 bg-green-600 text-white py-3 rounded-full text-[12px] font-bold">✅ OK - Voltar à Fatura</button></div></div></div>)}
      </div>
    </div>
  )
}