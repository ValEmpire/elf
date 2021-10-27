module.exports = {
  // ad queries
  orderBy: [
    "Price: lowest first",
    "Price: highest first",
    "Posted: newest first",
    "Posted: oldest first",
  ],

  orderByVal: [
    "laptops.price ASC",
    "laptops.price DESC",
    "ads.created_at DESC",
    "ads.created_at ASC",
  ],

  brands: [
    "Acer",
    "Alienware",
    "Apple",
    "Asus",
    "Dell",
    "Fujitsu",
    "Gateway",
    "Gigabyte",
    "Google",
    "HP",
    "LG",
    "Lenovo",
    "MSI",
    "Microsoft",
    "Panasonic",
    "Razer",
    "Samsung",
    "Sony",
    "Toshiba",
    "Other",
  ],

  screenSizes: [
    "12 inches and Smaller",
    "13 inches",
    "14 inches",
    "15 inches",
    "16 inches",
    "17 inches",
    "18 inches and Larger",
  ],

  screenSizeVal: [
    [0, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
    [17, 18],
    [18, 99],
  ],

  memorySizes: [4, 6, 8, 12, 14, 16, 20, 24, 32, 36, 40, 48, 64],

  storageSizes: [
    "Less than 128 GB",
    "128 GB - 255.9 GB",
    "256 GB - 511.9 GB",
    "512 GB - 749.9 GB",
    "750 GB - 999.9 GB",
    "1 TB - 1.9 TB",
    "2 TB - 2.9 TB",
    "3 TB - 3.9 TB",
    "4 TB and Higher",
  ],

  storageSizeVal: [
    [0, 128],
    [128, 256],
    [256, 512],
    [512, 750],
    [750, 1000],
    [1000, 1999],
    [2000, 2999],
    [3000, 3999],
    [4000, 9999],
  ],

  storageTypes: [
    "Hybrid Drive",
    "Solid State Drive (SSD)",
    "Hard Disk Drive (HDD)",
    "Embedded Multi-Media Card (eMMC)",
  ],

  conditions: [
    "New",
    "Open box",
    "Refurbished",
    "Used",
    "For parts or not working",
  ],

  prices: [
    "Under $100",
    "$100 - $250",
    "$250 - $500",
    "$500 - $750",
    "$750 - $1000",
    "Above $1000",
  ],

  priceVal: [
    [0, 100],
    [100, 250],
    [250, 500],
    [500, 750],
    [750, 1000],
    [1000, 9999],
  ],

  status: ["available", "pending", "sold"],
};
