<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting("E_ALL");

if (isset($_GET["mode"])) {
  $mode = $_GET["mode"];
  if ($mode == "song" || $mode == "food") {
    header("Content-type: application/json;charset=utf-8");
    getData($mode);
  } else {
    err_report();
    echo "Wrong parameter! Please enter song or food as mode parameter!";
  }
} else {
  err_report();
  echo "Missing mode parameter! Please enter a mode of song or food!";
}

function err_report() {
  header("HTTP/1.1 400 Invalid Request");
  header("Content-type: text/plain");
}

function getData($mode) {
  $images = glob("*/{$mode}/*.jpg");
  $mode_info = glob("*/{$mode}/*.txt");
  $results = array();
  if ($mode == "song") {
    for ($i = 0; $i < count($mode_info); $i ++) {
      $img_src = $images[$i];
      $items = file($mode_info[$i], FILE_IGNORE_NEW_LINES);
      $info = array("images"=>$img_src);
      foreach($items as $item) {
        $pair = explode(": ", $item);
        $info[$pair[0]] = $pair[1];
      }
      array_push($results, $info);
    }
  } else {
    for ($i = 0; $i < count($mode_info); $i ++) {
      $content = file_get_contents($mode_info[$i]);
      $split = explode("\n", $content, 2);
      $name = $split[0];
      $recipe = $split[1];
      $image = $images[$i];
      array_push($results, array("name"=>$name, "images"=>$image, "recipe"=>$recipe));
    }
  }
  print_r(json_encode($results));
}
?>
