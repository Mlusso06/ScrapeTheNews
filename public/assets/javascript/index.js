// run css and Html
$(document).ready(function() {

    const articleContainer = $(".article-container");

// buttons to do what we want to do (save or Scrape)
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
  
    initPage();
  // empty the article container
    function initPage() {
      articleContainer.empty();
      $.get("/api/headlines?saved=false").then(function(data) {
        if (data && data.length) {
          renderArticles(data);
        }
        else {
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      let articlePanels = [];
      for (let i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));
      }
      articleContainer.append(articlePanels);
    }
  
    // creating the panel and setting some elements to formate
    function createPanel(article) {
      let panel = $(
        [
          "<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h4>",
          "<a class='article-link' target='_blank' href='" + article.url + "'>",
          article.headline,
          "</a>",
          "<a class='btn btn-success save'>",
          "Save Article",
          "</a>",
          "</h4>",
          "</div>",
          "<div class='panel-body'>",
          article.summary,
          "</div>",
          "</div>"
        ].join("")
      );
      panel.data("_id", article._id);
      return panel;
    }
  
    function renderEmpty() {
      let emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
          "</div>",
          "<div class='panel panel-default'>",
          "<div class='panel-heading text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='panel-body text-center'>",
          "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      articleContainer.append(emptyAlert);
    }
  // based on the onclick to what the user has clicked on
    function handleArticleSave() {
      let articleToSave = $(this)
        .parents(".panel")
        .data();
      articleToSave.saved = true;
      $.ajax({
        method: "PUT",
        url: "/api/headlines/" + articleToSave._id,
        data: articleToSave
      }).then(function(data) {
        if (data.saved) {
            // reload and run the list of articles
          initPage();
        }
      });
    }
  // based on the onclick button to scrap new articls
    function handleArticleScrape() {
      $.get("/api/fetch").then(function(data) {
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      });
    }
  });