function calculateEAN13CheckDigit(ean12) {
    if (ean12.length !== 12) {
      throw new Error("The input must be 12 digits long");
    }
  
    let sumOdd = 0;
    let sumEven = 0;
  
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(ean12.charAt(i), 10);
      if (i % 2 === 0) {
        sumOdd += digit;
      } else {
        sumEven += digit;
      }
    }
  
    const total = sumOdd + (sumEven * 3);
    const remainder = total % 10;
    const checkDigit = (remainder === 0) ? 0 : 10 - remainder;
  
    return ean12 + checkDigit;
}
  
async function generate12DigitNumber(name, month, day) {
    // 入力データの結合
    const combinedString = `${name}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

    // ハッシュ関数の適用
    const encoder = new TextEncoder();
    const data = encoder.encode(combinedString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // ハッシュ値を16進数に変換
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 16進数のハッシュ値を10進数に変換し、12桁の数字を取り出す
    const decimalHash = BigInt('0x' + hashHex);
    const twelveDigitNumber = decimalHash.toString().substring(0, 12);

    return twelveDigitNumber;
}

document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
//    alert(name);

    if (!name || !month || !day) {
        alert('すべてのフィールドに入力してください');
        return;
    }

    const ean12 = await generate12DigitNumber(name, month, day);
    console.log(ean12);

    const ean13 = calculateEAN13CheckDigit(ean12);
    console.log(ean13);

    JsBarcode("#barcode", ean13, {format: "ean13"});
});
