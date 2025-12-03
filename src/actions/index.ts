import { action_login } from "./auth/login";
import { action_get_charts } from "./charts/get-many";
import { action_get_counts } from "./counts/get";
import { action_delete_file } from "./files/delete";
import { action_get_file } from "./files/get-one";
import { action_increment_file_views } from "./files/increment-views";
import { action_get_random_file } from "./files/random";
import { action_rearrange_files } from "./files/rearrange";
import { action_set_file_as_preview } from "./files/set-as-preview";
import { action_upload_files } from "./files/upload";
import { action_create_folder } from "./folders/create";
import { action_delete_folder } from "./folders/delete";
import { action_get_many_folders } from "./folders/get-many";
import { action_get_folder } from "./folders/get-one";
import { action_increment_folder_views } from "./folders/increment-views";
import { action_get_random_folder } from "./folders/random";
import { action_scan_folders } from "./folders/scan";
import { action_update_folder_links } from "./folders/update-links";
import { action_update_folder_names } from "./folders/update-names";
import { action_update_folder_tags } from "./folders/update-tags";
import { action_get_tags } from "./tags/get-many";
import { action_update_tags } from "./tags/update";
import { action_notify_about_bug } from "./telegram/notify-about-bug";

export {
  action_login,
  action_get_charts,
  action_get_counts,
  action_delete_file,
  action_get_file,
  action_increment_file_views,
  action_get_random_file,
  action_rearrange_files,
  action_set_file_as_preview,
  action_upload_files,
  action_create_folder,
  action_delete_folder,
  action_get_many_folders,
  action_get_folder,
  action_increment_folder_views,
  action_get_random_folder,
  action_scan_folders,
  action_update_folder_links,
  action_update_folder_names,
  action_update_folder_tags,
  action_get_tags,
  action_update_tags,
  action_notify_about_bug,
};
