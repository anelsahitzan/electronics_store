const fs = require('fs');
const path = require('path');

// Image pools by category
const imagesByCategory = {
  smartphones: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?q=80&w=1000&auto=format&fit=crop'
  ],
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop'
  ],
  monitors: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop'
  ],
  keyboards: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560762484-813fc97650a0?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?q=80&w=1000&auto=format&fit=crop'
  ],
  mice: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626771747863-71887e44e2ee?q=80&w=1000&auto=format&fit=crop'
  ],
  headphones: [
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop'
  ],
  'smart-watches': [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop'
  ],
  'gaming-consoles': [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop'
  ],
  tablets: [
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=1000&auto=format&fit=crop'
  ],
  pc: [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000&auto=format&fit=crop'
  ],
  tv: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552975084-6e027cd345c2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop'
  ],
  'storage-devices': [
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=1000&auto=format&fit=crop'
  ],
  components: [
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
  ]
};

console.log('Script template ready');
