'use strict';

const $ = require('jQuery');

let appId
const getAppApiUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/'
const getAppReviewApiUrl = 'https://store.steampowered.com/appreviews/'
const getAppReviewApiUrlOption = '?json=1&start_offset=0&language=all&purchase_type=all&num_per_page=0'
const getAppDetailApiUrl = 'https://store.steampowered.com/api/appdetails?appids='

fetch(getAppApiUrl)
.then(res => res.json())
.then(appData => {
  const apps = appData.applist.apps
  for(let i=500; i<510; i++) {
    const appName = apps[i].name
    appId = apps[i].appid
    const getAppReviewApi = getAppReviewApiUrl + appId + getAppReviewApiUrlOption
    const getAppDetailApi = getAppDetailApiUrl + appId
    Promise.all([
      fetch(getAppReviewApi),
      fetch(getAppDetailApi)
    ])
    .then(results => Promise.all(
      results.map(result => result.json()
      )
    ))
    .then(jsonData => {
      // jsonData[0]
      const appReviewData = jsonData[0].query_summary
      const totalReviews = appReviewData.total_reviews
      const totalPositive = appReviewData.total_positive
      const totalNegative = appReviewData.total_negative
      const reviewScoreDesc = appReviewData.review_score_desc
      // jsonData[1]
      const appDataKeys = Object.keys(jsonData[1])
      const appDetailData = jsonData[1][appDataKeys]
      const headerImg = appDetailData.data.header_image
      const appType = appDetailData.data.type
      const releaseDate = appDetailData.data.release_date.date
      const appPublisher = appDetailData.data.publishers[0]
      if(appDetailData.success) {
        $('#sample00-html').append(
          '<tr class="table-tr"><td><div class="table-td table-td--header"><p>'+ appName +
          '</p><img class="table-td__img" src="'+ headerImg +
          '"></div></td><td><div class="table-td txt-align-center"><div>'+ appType +
          '</div></div></td><td><div class="table-td txt-align-center"><div>'+ appPublisher +
          '</div></div></td><td><div class="table-td txt-align-center"><div>' + reviewScoreDesc +
          '</div></div></td><td><div class="table-td txt-align-center"><div>' + totalReviews +
          '</div></div></td><td><div class="table-td txt-align-center"><div>' + totalPositive +
          '</div></div></td><td><div class="table-td txt-align-center"><div>' + totalNegative +
          '</div></div></td><td><div class="table-td txt-align-center"><div>' + releaseDate +
          '</div></div></td></tr>'
        )
      } else {
        $('#sample00-html').append(
          '<div style="border-bottom: solid 1px;"><p>' + appName +
          '</p><p>No Data</p></div>'
        )
      }
    })
  }
})

