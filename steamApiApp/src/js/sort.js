'use strict';

const $ = require('jQuery');
/**
* クリックイベント
*/
$('th').click(function(){
  // 情報取得
  let ele = $(this).attr('id');
  let sortFlg = $(this).data('sort');
  // リセット
  $('th').data('sort', "");
  // ソート順序
  if(sortFlg == "" || sortFlg == "asc"){
    sortFlg = "desc";
    $(this).data('sort', "desc");
  }else{
    sortFlg = "asc";
    $(this).data('sort', "asc");
  }
  // テーブルソート処理
  sortTable(ele, sortFlg);
});

// ソートインジケーター表示変更
let ths = document.getElementsByClassName("th");
for (var i = 0; i < ths.length; i++) {
    ths[i].onclick = event => {
        let element = event.target;
        if (element.classList.contains('before')) {
            element.classList.replace('before', 'after');
        } else if (element.classList.contains('after')) {
            element.classList.replace('after', 'before');
        } else {
            element.classList.add('before');
        }

        Array.from(element.parentNode.children)
            .filter(e => e !== element)
            .forEach(e => e.classList.remove('before', 'after'));
    };
}


/**
* テーブルソートメソッド
*
* @param ele
* @param sortFlg
*/
function sortTable(ele, sortFlg){
  let arr = $('table tbody tr').sort(function(a, b){
    // ソート対象が数値の場合
    if($.isNumeric($(a).find('td').eq(ele).text())){
      let aNum = Number($(a).find('td').eq(ele).text());
      let bNum = Number($(b).find('td').eq(ele).text());
      if(sortFlg == "asc"){
        return aNum - bNum;
      }else{
        return bNum - aNum;
      }
    }else{ // ソート対象が数値でない場合
      let sortNum = 1;
      // 比較時は小文字に統一
      if($(a).find('td').eq(ele).text().toLowerCase() > $(b).find('td').eq(ele).text().toLowerCase()){
        sortNum = 1;
      }else{
        sortNum = -1;
      }
      if(sortFlg == "desc"){
        sortNum *= (-1);
      }
      return sortNum;
    }
  });
  $('table tbody').html(arr);
}