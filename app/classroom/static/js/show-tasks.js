/*
*   -This function inserts a single materialize css card in the document
*   @Author: Marcos Costa Santos
*   -Parameters
*   @Title: Define the title of card.
*   @content: The text used in card description.
*   @target: Class from the div to insert the card in.
*   @image_url: String that contains the image url.
*   @image_description: String explaining the image, it's used for UX
*/
function insertCard(title, content, target = 'cards-container', image_url = 'http://materializecss.com/images/sample-1.jpg', image_description = 'A lake and tree around some mountains.'){

  //  Template for one generic materialize.css card to be inserted in the document.
  var card_template = `
    <div class="col s3">

      <div class="card">

        <div class="card-image">
          <img src="`+image_url+`" alt="`+image_description+`">
          <span class="card-title">`+title+`</span>
          <a onclick="" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
        </div>

        <div class="card-content">
          <p class="truncate">`+content+`</p>
        </div>

      </div>
    </div>
  `;

  //  Insert card in html page
  document.getElementById(target).innerHTML += card_template;

}