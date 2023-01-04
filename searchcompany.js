/*jslint white:false */
/*globals IN, Mustache, Sslac, console */
IN.$extensions("SearchCompany", function SearchCompany() {
  // NOTE: This is required for development in linkedin.biz domains
  var ORIGINAL_XDURL = IN.ENV.url.xd_us_html;
  // END REQUIRED
  
  Sslac.Class("IN.Tags.SearchCompany").Extends("IN.Tags.Base").Constructor(function(el, attributes) {
    this.Parent(el, attributes);

    // NOTE: This is required for development on linken.biz domains
    IN.ENV.url.xd_us_html = "http://szhang-mn.linkedin.biz/~szhang/search2/xdrpc.html";
    // END REQUIRED
    
    var that = this;
    
    IN.Event.onOnce(IN, "auth", function () {
      IN.API.Raw("people-search:(people:(id,first-name,last-name,headline,picture-url,location,site-standard-profile-request,industry,distance))?count=21&facet=current-company," + attributes.id)
          .result(function peopleSearchCallback(result) { 
            var view, template, markup;
            
            view = { users: result.people.values };
            
            
            for (i=0; i<view.users.length; i++)
            {
              curRow = (i+1) / 4;
              view.users[i].row =  curRow <= 3 ? "bottom" : "top";
              view.users[i].col = i % 4 + 1; 
              view.users[i].pictureUrl = view.users[i].pictureUrl == undefined ? "http://static02.linkedin.com/scds/common/u/img/icon/icon_no_photo_40x40.png" : view.users[i].pictureUrl;
              view.users[i].action = view.users[i].distance == 1 ? "SEND MESSAGE" : "CONNECT";
            }
            
            console.log(view);
            
            template = [
              '<ul class="user-list">',
              '{{#users}}',
              '  <li class="user">',
              '    <img src="{{pictureUrl}}" class="profile-photo"/>',
              '    <div class="profile-info {{row}} col-{{col}}">',
              '      <div class="notch"></div>',
              '      <div class="content">',
              '        <span>',
              '        <a class="name" href="{{#siteStandardProfileRequest}}{{url}}{{/siteStandardProfileRequest}}" target="_blank">{{firstName}} {{lastName}}</a>',
              '        <span class="close"></span>',    
              '        </span>',
              '        <h3 class="headline">{{headline}}</h3>',
              '        <h4 class="location">{{#location}}{{name}}{{/location}}</h4>',
              '        <a class="action" href="{{#siteStandardProfileRequest}}{{url}}{{/siteStandardProfileRequest}}" target="_blank">{{action}}</a>',
              
              '      </div>',
              '    </div>',
              '  </li>',
              '{{/users}}',
              '</ul>'
            ].join('');
            
            
            
            // Do stuff here.
            
            // Parse data and render.
            
            markup = Mustache.to_html(template, view);
            // console.log(markup);
            that.el().innerHTML = markup;
            
            $('.user-list').ready(function () {
              var people = $('.profile-photo');

              people.click(function () {
                $('.user .profile-info').hide()
                $(this).siblings('.profile-info').show();
              });

              $('.profile-info .close').click(function () {
                $(this).parents('.profile-info').hide();
              })
            });
        });
    });
    
    
    
    

    
    
    
    
    
    
    
    // var win = new IN.Objects.SmartWindow({
    //   mode: "embedded",
    //   url: "http://jheuser-md.linkedin.biz/~hackday/hackday/plugin/plugin.html"
    // });
    // win.place(this.el());
    
    // NOTE: This is required for development on linken.biz domains
    IN.ENV.url.xd_us_html = ORIGINAL_XDURL;
    // END REQUIRED
  });

  IN.addTag("SearchCompany", IN.Tags.SearchCompany);

  // console.log("HelloWorld Extension has Executed");
});
