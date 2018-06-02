## stockton-accessibility: file structure

### index.html - the site layout, reading in relevant .js and .css files

### js - all the js files
   * amenities.js - a converted geojson of all the amenities used in the site
   * blockGroups.js - a converted geojson of all the blockgroups used in the site
   * distances.js - the distance matrix
   * pop.js - Population counts for all block groups in stockton
   * scripts.js - where all the visualization and calculations are done, all the other files work are called within this one
   * sspz_BGs.js - All IDs of block groups in the South Stockton Promise Zone (SSPZ)
   * sspz.js - a converted geojson of the blockgroups comprising the SSPZ
   * sspzPop.js - population counts within the SSPZ
   
### css - some styling for index.html (some is done in the html file as well)
