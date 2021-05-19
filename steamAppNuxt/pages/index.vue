<template>
  <div class="container">
    <div class="flex__left flex-direction-column">
      <div class="select__container">
        <select id="search" name="カテゴリ">
          <option value="">all</option>
          <option value="game">game</option>
          <option value="dlc">dlc</option>
          <option value="music">music</option>
          <option value="music">demo</option>
        </select>
        <input id="button" type="button" value="絞り込む" />
      </div>
      <div class="">
        <table id="table" class="table table-info table-striped table-bordered">
          <thead>
            <tr class="tr-th">
              <th id="0" data-sort="" class="th">
                <p class="no-event">Name</p>
              </th>
              <th id="1" data-sort="" class="th">
                <p class="no-event">Type</p>
              </th>
              <th id="2" data-sort="" class="th">
                <p class="no-event">パブリッシャー</p>
              </th>
              <th id="3" data-sort="" class="th">
                <p class="no-event">レビュー</p>
              </th>
              <th id="4" data-sort="" class="th">
                <p class="no-event">総評価数</p>
              </th>
              <th id="5" data-sort="" class="th">
                <p class="no-event">総高評価数</p>
              </th>
              <th id="6" data-sort="" class="th">
                <p class="no-event">総低評価数</p>
              </th>
              <th id="7" data-sort="" class="th">
                <p class="no-event">発売日</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in appNames.length" :key="n" class="table-tr">
              <td>
                <div class="table-td table-td--header">
                  <p>
                    {{ appNames[n] }}
                  </p>
                  <img class="table-td__img" :src="headerImgs[n]" />
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ appTypes[n] }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ appPublishers[n] }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ reviewScoreDescs[n] }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ totalReviews[n] }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ totalPositives[n] }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ totalNegatives[n] }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-td txt-align-center">
                  <div>
                    {{ releaseDates[n] }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import jQuery from 'jquery'
global.jquery = jQuery
global.$ = jQuery
window.$ = window.jQuery = require('jquery')
const $ = require('jQuery')

export default {
  data() {
    return {
      appNames: [],
      // jsonData[0]
      totalReviews: [],
      totalPositives: [],
      totalNegatives: [],
      reviewScoreDescs: [],
      // jsonData[1]
      headerImgs: [],
      appTypes: [],
      releaseDates: [],
      appPublishers: [],
    }
  },
  mounted() {
    axios
      .get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
      .then((appData) => {
        const apps = appData.data.applist.apps
        for (let i = 500; i < 510; i++) {
          this.appNames.push(apps[i].name)
          const appId = apps[i].appid
          Promise.all([
            fetch(
              'https://store.steampowered.com/appreviews/' +
                appId +
                '?json=1&start_offset=0&language=all&purchase_type=all&num_per_page=0'
            ),
            fetch(
              'https://store.steampowered.com/api/appdetails?appids=' + appId
            ),
          ])
            .then((results) =>
              Promise.all(results.map((result) => result.json()))
            )
            .then((jsonData) => {
              // jsonData[0]
              const appReviewData = jsonData[0].query_summary
              this.totalReviews.push(appReviewData.total_reviews)
              this.totalPositives.push(appReviewData.total_positive)
              this.totalNegatives.push(appReviewData.total_negative)
              this.reviewScoreDescs.push(appReviewData.review_score_desc)
              // jsonData[1]
              const appDataKeys = Object.keys(jsonData[1])
              const appDetailData = jsonData[1][appDataKeys]
              this.headerImgs.push(appDetailData.data.header_image)
              this.appTypes.push(appDetailData.data.type)
              this.releaseDates.push(appDetailData.data.release_date.date)
              this.appPublishers.push(appDetailData.data.publishers[0])
            })
        }
      })
    $(function () {
      $('#button').on('click', function () {
        const re = new RegExp($('#search').val())
        $('#table tbody tr').each(function () {
          const tr = $(this)
          tr.hide()
          $('td', this).each(function () {
            const txt = $(this).html()
            if (txt.match(re) != null) {
              tr.show()
            }
          })
        })
      })
    })
    $('th').click(function () {
      // 情報取得
      const ele = $(this).attr('id')
      let sortFlg = $(this).data('sort')
      // リセット
      $('th').data('sort', '')
      // ソート順序
      if (sortFlg === '' || sortFlg === 'asc') {
        sortFlg = 'desc'
        $(this).data('sort', 'desc')
      } else {
        sortFlg = 'asc'
        $(this).data('sort', 'asc')
      }
      // テーブルソート処理
      sortTable(ele, sortFlg)
    })

    // ソートインジケーター表示変更
    const ths = document.getElementsByClassName('th')
    for (let i = 0; i < ths.length; i++) {
      ths[i].onclick = (event) => {
        const element = event.target
        if (element.classList.contains('before')) {
          element.classList.replace('before', 'after')
        } else if (element.classList.contains('after')) {
          element.classList.replace('after', 'before')
        } else {
          element.classList.add('before')
        }

        Array.from(element.parentNode.children)
          .filter((e) => e !== element)
          .forEach((e) => e.classList.remove('before', 'after'))
      }
    }

    /**
     * テーブルソートメソッド
     *
     * @param ele
     * @param sortFlg
     */
    function sortTable(ele, sortFlg) {
      const arr = $('table tbody tr').sort(function (a, b) {
        // ソート対象が数値の場合
        if ($.isNumeric($(a).find('td').eq(ele).text())) {
          const aNum = Number($(a).find('td').eq(ele).text())
          const bNum = Number($(b).find('td').eq(ele).text())
          if (sortFlg === 'asc') {
            return aNum - bNum
          } else {
            return bNum - aNum
          }
        } else {
          // ソート対象が数値でない場合
          let sortNum = 1
          // 比較時は小文字に統一
          if (
            $(a).find('td').eq(ele).text().toLowerCase() >
            $(b).find('td').eq(ele).text().toLowerCase()
          ) {
            sortNum = 1
          } else {
            sortNum = -1
          }
          if (sortFlg === 'desc') {
            sortNum *= -1
          }
          return sortNum
        }
      })
      $('table tbody').html(arr)
    }
  },
}
</script>

<style lang="scss">
.container {
  margin: 50px;
  min-height: 100vh;
}
@mixin flex {
  display: flex;
}
@mixin flex-center {
  justify-content: center;
  align-items: center;
}
@mixin flex-left {
  justify-content: left;
  align-items: center;
}
.txt-align-center {
  text-align: center;
}
.flex-direction-column {
  flex-direction: column;
}
.table {
  width: 100%;
  border: solid 1px #000000;
  border-collapse: collapse;
  &-td {
    display: flex;
    flex-direction: column;
    p {
      width: 300px;
    }
    &__img {
      width: 300px;
    }
  }
}
.flex__center {
  @include flex;
  @include flex-center;
}
.flex__left {
  @include flex;
  @include flex-left;
}
.tr-th {
  :hover {
    background-color: rgb(124, 124, 124);
    cursor: pointer;
  }
}
</style>
