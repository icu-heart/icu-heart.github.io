$(function () {
    var $content = $('#jsonContent');
    var mediumNames = ["icu-heart", "critical-care-futures"];
    var apiKey = "<YOUR api.rss2json.com API KEY>";
    var allArticles = [];

    // Fetch RSS feed from Medium for a given blog
    function fetchFeed(mediumName) {
        return $.ajax({
            url: 'https://api.rss2json.com/v1/api.json',
            method: 'GET',
            dataType: 'json',
            data: { rss_url: 'https://medium.com/feed/' + mediumName }
        });
    }

    // Fetch both blog feeds simultaneously
    var requests = mediumNames.map(fetchFeed);

    $.when.apply($, requests).done(function (...responses) {
        responses.forEach(function (responseWrapper, index) {
            var responseData = responseWrapper[0]; 
            if (responseData.status == 'ok') {
                responseData.items.forEach(function (item) {
                    item.source = mediumNames[index]; 
                    allArticles.push(item);
                });
            }
        });

        // Sort articles by publication date 
        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // Empty HTML structure to fill by appending each blog
        var output = '';

        // Loop through all articles in time order
        allArticles.forEach(function (item) {
            // NB here "author" is really the feed e.g. "ICU Heart"
            var author = "https://medium.com/" + item.source; 
            
            // Extract image (if any) from the description field
            var tagIndex = item.description.indexOf('<img'); 
            var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; 
            var srcStart = srcIndex + 5; 
            var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; 
            var src = item.description.substring(srcStart, srcEnd);

            // Add different circular image depending on whether it's an ICU-H
            // or a CCF blog post
            var profileImage = "";
            if (item.source === "icu-heart") {
                profileImage = "images/favicon.png"; 
            } else if (item.source === "critical-care-futures") {
                profileImage = "images/ccf.png"; 
            }

            if (!src.match(/https?:\/\/(medium\.com\/_\/.+)/g)) {
                var time = item.pubDate;
                time = time.replace(/\s/, 'T') + 'Z';
                var formattedDate = new Date(time);
                var day = formattedDate.getDate();
                var month = formattedDate.getMonth() + 1;
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var month_str = months[month - 1];

                var trimmedString = item.description.replace(/<img[^>]*>/g, "").substr(0, 250);
                trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

                // Append HTML for blog post
                output += `
                    <div class="row">
                        <div class="col-12 col-centered" style="margin: auto;">
                            <div class="mainbox">
                                <div>
                                    <div class="profile_img">
                                        <div class="u">
                                            <div class="dm">
                                                <div class="dn">
                                                    <div>
                                                        <img alt="${item.author}" style="border-radius: 50%; height: 40px; width: 40px;" src="${profileImage}" class="dp">
                                                    </div>
                                                    <div class="dr">
                                                        <a href="${author}" target="_blank"> <span class="bx">${item.author}</span></a>
                                                        <span class="af">${month_str} ${day}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dsbox">
                                        <div class="dubox">
                                            <div class="dvbox">
                                                <a href="${item.link}" target="_blank"><img src="${src}" class="bhbox" width="720" height="210"></a>
                                            </div>
                                        </div>
                                        <a href="${item.link}" target="_blank"><h3 class="eafont">${item.title}</h3></a>
                                        <div class="blog-cont">
                                            <p>${trimmedString}...</p>
                                            <p><a href="${item.link}" target="_blank"> Continue reading...</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }
        });

        // Display the articles in the content area
        $content.html(output);
    });
});
