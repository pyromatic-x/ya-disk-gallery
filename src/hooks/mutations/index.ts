import { use_login_mutation } from "./auth/login";
import { use_delete_file_mutation } from "./files/delete";
import { use_get_random_file_mutation } from "./files/random";
import { use_rearrange_files_mutation } from "./files/rearrange";
import { use_set_as_preview_mutation } from "./files/set-as-preview";
import { use_upload_files_mutation } from "./files/upload";
import { use_create_folder_mutation } from "./folders/create";
import { use_delete_folder_mutation } from "./folders/delete";
import { use_get_random_folder_mutation } from "./folders/random";
import { use_scan_folders_mutation } from "./folders/scan";
import { use_update_folder_links_mutation } from "./folders/update-links";
import { use_update_folder_names_mutation } from "./folders/update-names";
import { use_update_folder_tags_mutation } from "./folders/update-tags";
import { use_update_tags_mutation } from "./tags/update";
import { use_notify_about_bug_mutation } from "./telegram.ts/nofity-about-bug";

export {
  use_login_mutation,
  use_delete_file_mutation,
  use_get_random_file_mutation,
  use_rearrange_files_mutation,
  use_set_as_preview_mutation,
  use_upload_files_mutation,
  use_create_folder_mutation,
  use_delete_folder_mutation,
  use_get_random_folder_mutation,
  use_scan_folders_mutation,
  use_update_folder_links_mutation,
  use_update_folder_names_mutation,
  use_update_folder_tags_mutation,
  use_update_tags_mutation,
  use_notify_about_bug_mutation,
};
