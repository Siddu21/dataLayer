var MYPROJECT = MYPROJECT || {};
MYPROJECT.dataLayer = (function() {
    window.digitalData = {
        //pageLoad 
        'pageInfo': {            
            'pageName': '',                        
            'url': '',
            'compareProducts':''                    
        },        
        'category': {
            'pageType': '',
            // segments of url after language segment                     
            'siteSection': '',
            'siteSection1': '',
            'siteSection2': '',
            'siteSection3': ''          
        },
        /*attributes*/
        'attributes':{
            /*organisation name*/
            'org': '',
            /*country code*/
            'country': '',
            /*country language*/
            'language': '',            
        },
        /*user info*/
        'userInfo':{
            'loginStatus': '',
        },
        /*below author,title,dop values will be populated only for blog pages*/
        'article':{           
            'author': '',
            'title': '',
            'dop': ''
        },
        /*search related data*/
        'searchInfo':{
            'searchTerm': '',
            'numOfResults': ''           
        },        
        'videoInfo':{
            'videoId': ''                       
        },
        /* onClick event values */
        'onClick':{
            'formInfo':{                
                'formName': '',                 
                'formAction': ''                  
            },
            'videoInfo':{
                'videoId': ''               
            },
            'linkInfo':{
                'linkName':'',
                'linkTitle':'',
                'navigation':'',
                'category':''
            },
            'searchClickInfo':{
                'searchLink':'',
                'searchCategory':''
            }                       
        }
    };   
    var $actionLink; 
    // video names for inline videos for pageLoad
    function _videoName() {
        var inlineVideoId = '',
            inlineVideoArray = [],
            $inlineVideo = $('.video__background-video'),
            videoCount = $inlineVideo.length;
        if (videoCount) {
            $inlineVideo.each(function(index, item) {
                var videoName = $(item).find('source').attr('src').replace(/^.*[/\/]/, '');
                if (videoCount === 1) {
                    inlineVideoId = videoName;
                    return false;
                } else {
                    inlineVideoArray.push(videoName);
                    inlineVideoId = inlineVideoArray.join('|');
                }
            });

        }
        _video({'videoId': inlineVideoId });
    }
    // onClick get form values
    function _formActionCheck(param) {
        var emailSignUpForm = $('#email-signup-form').length,
            formVals;
        if (emailSignUpForm && (param && param.indexOf('email=') >= 0)) {
            formVals = {
                'formInfo' : {
                    'formName': 'email-signup-short-form',
                    'formAction': 'Success'
                }                
            };
            _onClick(formVals);
        }
    }
    
    // splitting url values and using corresponding values
    function _urlRelatedValues(languageVal, currentUrl, countryVal) {        
        var urlSplitVals, pageNameVal, siteSectionVals, pageInfoVals, categoryVals;
        // getting pageNameVal using countryVal  
        if (languageVal && currentUrl) {
            languageVal = languageVal.split('_')[0];
            var currentUrlArray = currentUrl.split('?'),
                pageTypeVal = '';
            currentUrl = currentUrlArray[0];
            urlSplitVals = currentUrl.split(languageVal + '/')[1];
            var urlSegments = urlSplitVals.split('/');
            pageNameVal = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);            
            siteSectionVals = $.map(urlSegments, function(item, index) {                
                return item;
            });   
            // page type val
            if (dataLayerObj.pageType) {
                pageTypeVal = dataLayerObj.pageType;
                pageTypeVal = pageTypeVal.substring(pageTypeVal.lastIndexOf('/') + 1);
                // if pageType is compare capture the products
                var $compareProductHeading = $('.comparison-page-product-card__headline'),
                    productList = '',
                    productListVal={};
                if(pageTypeVal === 'compare' && $compareProductHeading.length){
                    $compareProductHeading.each(function(){
                        productList = productList + $(this).text() + ' | ';
                    })
                    productListVal = {'compareProducts': productList.substring(0,productList.length-2)}
                    _pageInfo(productListVal);
                }
            }         
            // assigning to digitalData            
            pageInfoVals = {
                'url': currentUrl,
                'pageName': pageNameVal
            };
            categoryVals = {
                'pageType': pageTypeVal.trim(),
                'siteSection': siteSectionVals[0] ? siteSectionVals[0] : '',
                'siteSection1': siteSectionVals[1] ? siteSectionVals[1] : '',
                'siteSection2': siteSectionVals[2] ? siteSectionVals[2] : '',
                'siteSection3': siteSectionVals[3] ? siteSectionVals[3] : ''                
            };
            _pageInfo(pageInfoVals);
            _category(categoryVals);
            _formActionCheck(currentUrlArray[1]);
        }
    }

    function _capturePagePros(pageParam, values) {
        digitalData[pageParam] = $.extend({}, digitalData[pageParam], values);
    }
    function _pageInfo(param) {
        _capturePagePros('pageInfo', param);
    }
    function _userInfo(param){
        _capturePagePros('userInfo', param);
    }
    function _category(param) {
        _capturePagePros('category', param);
    }
    function _attributes(param) {
        _capturePagePros('attributes', param);
    }
    function _searchInfo(param) {
        _capturePagePros('searchInfo', param);
    }
    function _video(param) {
        _capturePagePros('videoInfo', param);
    }
    function _article(param) {
        _capturePagePros('article', param);
    }
    function _onClick(param) {
        _capturePagePros('onClick', param);
    }

    // every page load following function execute
    function _pageLoad() {
        window.dataLayerObj = window.dataLayerObj || {};
        var currentUrl = window.location ? location.href : '',
            languageVal = dataLayerObj.language ? dataLayerObj.language : '',
            countryVal = dataLayerObj.country ? dataLayerObj.country : '';            
        
        var loginStatus = {            
                'loginStatus': window.loginStatus ? 'Logged In' : 'Not Logged In',
            },
            attributeVals = {
                'country': countryVal.toUpperCase(),
                'language': languageVal.toUpperCase(),
                'org': 'MYPROJECT'                
            },
            articleVals = {
                'author': dataLayerObj.author ? dataLayerObj.author : '',
                'title': dataLayerObj.title ? dataLayerObj.title : '',
                'dop': dataLayerObj.dop ? dataLayerObj.dop : '',
            };
        _userInfo(loginStatus);
        _attributes(attributeVals);
        _article(articleVals);        
        _urlRelatedValues(languageVal, currentUrl, countryVal);
        _videoName();
    }  
    function _onClickCustomVals(){
        $actionLink = $('.cmp-teaser__link , .cmp-teaser__action-link ,.link-list__col-link , .cmp-image__link');
        // values for analytics
        $actionLink.on('click',function(){
            var $this = $(this),
                $headerNavLink = $this.closest('.global-navigation__nav-list-item'),
                objVal,
                categoryVal = '';              
            if($headerNavLink.length){
                categoryVal = $headerNavLink.find('.cmp-teaser__link').attr('title');
                objVal = {
                    'linkInfo' :{
                        'linkName': $headerNavLink.find('.global-navigation__nav-list-link').attr('title'),
                        'linkTitle': $this.attr('title'),
                        'navigation':'header',
                        'category': categoryVal
                    }
                }                               
            } else if($this.closest('.site-footer__col').length){
                objVal = {
                    'linkInfo' :{                        
                        'linkTitle': $this.attr('title'),
                        'navigation':'footer',                        
                    }
                } 
            }else{
                objVal = {
                    'linkInfo' :{                        
                        'linkTitle': $this.attr('title'),                                           
                    }
                } 
            }
            MYPROJECT.dataLayer.onClick(objVal);            
        });
    }  
    
    function _init() {         
        _pageLoad();
        _onClickCustomVals();
    }
    return {
        init: _init,
        onClick: _onClick,
        pageInfo: _pageInfo,
        userInfo: _userInfo,
        category: _category,
        attributes: _attributes,
        searchInfo: _searchInfo,
        video: _video,
        article: _article
    };
}());
$(document).ready(function() {    
    MYPROJECT.dataLayer.init();    
});