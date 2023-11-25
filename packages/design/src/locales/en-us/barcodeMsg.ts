export default {
    'CODE128': 'CODE128 is one of the more versatile barcodes. It has support for all 128 ASCII characters but does also encode numbers efficiently. It has three modes (A/B/C) but can switch between them at any time. CODE128 is the default barcode that will choose if nothing else is specified. Example: Example1234',
    'CODE128A': 'If the barcode scanner only support one type of CODE128 you can force that mode. Example: EXAMPLE\n1234',
    'CODE128B': 'If the barcode scanner only support one type of CODE128 you can force that mode. Example: Example1234',
    'CODE128C': 'If the barcode scanner only support one type of CODE128 you can force that mode. Example: 12345678',
    'CODE39': 'CODE39 is an old barcode type that can encode numbers, uppercase letters and a number of special characters (-, ., $, /, +, %, and space). It has been a common barcode type in the past but CODE128 is recommended if not for legacy reasons. Example: ABCDEFG',
    'EAN2': 'EAN comes in a variety of forms, most commonly used is EAN-13 (GTIN-13) that is used on world wide to marking the identity of products.\n' +
        'Supports the formats EAN-13, EAN-8 and UPC as well as the barcode addons EAN-5 and EAN-2. Example: 53',
    'EAN5': 'EAN comes in a variety of forms, most commonly used is EAN-13 (GTIN-13) that is used on world wide to marking the identity of products.\n' +
        'Supports the formats EAN-13, EAN-8 and UPC as well as the barcode addons EAN-5 and EAN-2. Example: 54495',
    'EAN8': 'EAN comes in a variety of forms, most commonly used is EAN-13 (GTIN-13) that is used on world wide to marking the identity of products.\n' +
        'Supports the formats EAN-13, EAN-8 and UPC as well as the barcode addons EAN-5 and EAN-2. Example: 96385074',
    'EAN13': 'EAN comes in a variety of forms, most commonly used is EAN-13 (GTIN-13) that is used on world wide to marking the identity of products.\n' +
        'Supports the formats EAN-13, EAN-8 and UPC as well as the barcode addons EAN-5 and EAN-2. Example: 5901234123457',
    'UPC': 'EAN comes in a variety of forms, most commonly used is EAN-13 (GTIN-13) that is used on world wide to marking the identity of products.\n' +
        'Supports the formats EAN-13, EAN-8 and UPC as well as the barcode addons EAN-5 and EAN-2. Example: 123456789999',
    'UPC-E': 'EAN comes in a variety of forms, most commonly used is EAN-13 (GTIN-13) that is used on world wide to marking the identity of products.\n' +
        'Supports the formats EAN-13, EAN-8 and UPC as well as the barcode addons EAN-5 and EAN-2. Example: 12345678',
    'ITF': 'ITF-14 (Interleaved Two of Five) is the GS1 implementation of an Interleaved 2 of 5 bar code to encode a Global Trade Item Number. ITF-14 symbols are generally used on packaging levels of a product, such as a case box of 24 cans of soup. The ITF-14 will always encode 14 digits. Example: 12345678',
    'ITF14': 'ITF-14 (Interleaved Two of Five) is the GS1 implementation of an Interleaved 2 of 5 bar code to encode a Global Trade Item Number. ITF-14 symbols are generally used on packaging levels of a product, such as a case box of 24 cans of soup. The ITF-14 will always encode 14 digits. Example: 12345678901231',
    'MSI': 'MSI or Modified Plessey is a barcode developed by the MSI Data Corporation and is primarily used for inventory control, marking storage containers and shelves in warehouse environments. It supports digits 0-9. Provides automatic checksum calculation of Mod 10, Mod 11, Mod 1010 and Mod 1110. Example: 1234',
    'MSI10': 'MSI or Modified Plessey is a barcode developed by the MSI Data Corporation and is primarily used for inventory control, marking storage containers and shelves in warehouse environments. It supports digits 0-9. Provides automatic checksum calculation of Mod 10, Mod 11, Mod 1010 and Mod 1110. Example: 1234',
    'MSI11': 'MSI or Modified Plessey is a barcode developed by the MSI Data Corporation and is primarily used for inventory control, marking storage containers and shelves in warehouse environments. It supports digits 0-9. Provides automatic checksum calculation of Mod 10, Mod 11, Mod 1010 and Mod 1110. Example: 1234',
    'MSI1010': 'MSI or Modified Plessey is a barcode developed by the MSI Data Corporation and is primarily used for inventory control, marking storage containers and shelves in warehouse environments. It supports digits 0-9. Provides automatic checksum calculation of Mod 10, Mod 11, Mod 1010 and Mod 1110. Example: 1234',
    'MSI1110': 'MSI or Modified Plessey is a barcode developed by the MSI Data Corporation and is primarily used for inventory control, marking storage containers and shelves in warehouse environments. It supports digits 0-9. Provides automatic checksum calculation of Mod 10, Mod 11, Mod 1010 and Mod 1110. Example: 1234',
    'codabar': 'CODE39 is an old barcode type that can encode numbers, uppercase letters and a number of special characters (-, ., $, /, +, %, and space). It has been a common barcode type in the past but CODE128 is recommended if not for legacy reasons. Example: 1234567890, C1234567890D',
    'pharmacode': 'Pharmacode is a barcode used in the pharmaceutical industry. It can encode numbers 3 to 131070. Example: 1234'
}
