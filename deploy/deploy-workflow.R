add_connect_server <- function() {
  if (!(Sys.getenv("CONNECT_SERVER") %in% rsconnect::servers()$url)) {
    message("Adding server")
    rsconnect::addServer(
      url = Sys.getenv("CONNECT_SERVER"),
      name = "rsc-prod"
    )
  }
}

cleanup_connect_user <- function() {
  if (Sys.getenv("CONNECT_USER") %in% rsconnect::accounts(server = "rsc-prod")$name) {
    message("Cleanup previous session ...")
    rsconnect::removeAccount(
      Sys.getenv("CONNECT_USER"),
      "rsc-prod"
    )
    message(
      sprintf(
        "Removed user: %s from server: %s",
        Sys.getenv("CONNECT_USER"), "rsc-prod"
      )
    )
  }
}

register_connect_user <- function() {
  message("Adding user")
  rsconnect::connectApiUser(
    account = Sys.getenv("CONNECT_USER"),
    server = "rsc-prod",
    apiKey = Sys.getenv("CONNECT_API_KEY")
  )
}

allow_users_access <- function(
  users = c(
    #"david",
    "nicolas",
    "christoph"
  ),
  app_name
) {
  # Get users and content from RSC client
  rsc_client <- connectapi::connect()
  rsc_content <- connectapi::get_content(rsc_client)
  rsc_users <- connectapi::get_users(rsc_client, limit = Inf)
  # Get users guids
  users_guids <- rsc_users |>
    dplyr::filter(username %in% users) |>
    dplyr::pull(guid)

  # Get content guid
  # Be careful if CONNECT_USER changes: in that case
  # on would have to use connectapi::content_update_owner
  # for each app to transfer ownership ...
  # See the inst/utils/transfer-app-ownership.R
  # that automates this process.
  owner_guid <- rsc_users |>
    dplyr::filter(username == Sys.getenv("CONNECT_USER")) |>
    dplyr::pull(guid)

  content_guid <- rsc_content |>
    dplyr::filter(
      grepl(app_name, .data$name) &
        owner_guid == owner_guid
    ) |>
    dplyr::pull(guid)

  # Content object (R6) necessary for
  # connectapi::content_add_user and
  # connectapi::set_vanity_url. This is different
  # from the content tibble.
  content_obj <- connectapi::content_item(
    rsc_client,
    content_guid
  )

  # Setting environment variables.
  # Requires to setup env vars from GitLab CICD
  #message("Setting environment variables ...")
  #content_env <- connectapi::get_environment(content_obj)
  #connectapi::set_environment_all(
  #  env = content_env,
  #  "ENV_VAR" = ...,
  #  "ENV_2" = Sys.getenv("..."),
	#  ...
  #)

  # Update content access with API
  lapply(seq_along(users), function(i) {
    message(
      sprintf(
        "Adding user %s as viewer for %s",
        users[[i]],
        app_name
      )
    )
    connectapi::content_add_user(
      content_obj,
      users_guids[[i]],
      "owner"
    )
  })

  # Set custom url
  message(
    sprintf(
      "To view the app, browse to: %s",
      sprintf(
        "%s%s",
        Sys.getenv("CONNECT_SERVER"),
        tolower(app_name)
      )
    )
  )
  connectapi::set_vanity_url(
    content = content_obj,
    url = tolower(app_name)
  )
}

# Required by CICD to deploy on dev, prod or a specific branch
deploy_app_rsc <- function(app_name, app_path) {
  message(sprintf("Preparing to deploy %s", app_name))

  # Required for R4.1.0 runner to avoid SSL issues
  #Sys.setenv(
  #  http_proxy = "",
  #  https_proxy = "",
  #  no_proxy = "",
  #  noproxy = ""
  #)

  # For SSL debugging
  # options(rsconnect.http.verbose = TRUE)

  # Before going further you'll have to create some
  # ENV variables from GitHub:
  # CONNECT_API_KEY -> API key obtained from Posit Connect UI.
  # CONNECT_SERVER -> https://<CONNECT_URL>
  # CONNECT_USER -> your connect ID, lower characters.
  # Also a GITHUB_PAT just in case you need github.

  # Add server and connect to the account if necessary
  # This MUST be done only once!!!
  add_connect_server()

  # Cleanup previous sessions
  cleanup_connect_user()

  # Register the user
  register_connect_user()

  # Deploy!
  app_name <- sub("\\.", "", app_name)

  tryCatch(
    {
      rsconnect::deployApp(
        appDir = app_path,
        appPrimaryDoc = NULL,
        appName = app_name,
        appTitle = app_name,
        appId = NULL,
        forceUpdate = TRUE,
        logLevel = "verbose",
        account = Sys.getenv("CONNECT_USER"),
        server = "rsc-prod",
        launch.browser = FALSE
      )

      message("App successfully deployed ...")

      # Adding extra users to user viewer list
      # Viewer write should be enough
      allow_users_access(app_name = app_name)
    },
    error = function(e) {
      message(
        sprintf(
          "\n---- Error deploying %s. Please review below  ----\n",
          app_name
        )
      )
      stop(e$message)
    }
  )
}
