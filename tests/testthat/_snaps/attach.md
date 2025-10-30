# if no packages, shows nothing

    Code
      cat(blockr_attach_message(character()))

# message lists all core tidyverse packages

    Code
      cat(blockr_attach_message(blockr_pkgs))
    Output
      -- Attaching blockr packages ----------------------------------- blockr 1.0.0 --
      v blockr.core   1.0.0     v blockr.io     1.0.0
      v blockr.dplyr  1.0.0     v blockr.ui     1.0.0
      v blockr.ggplot 1.0.0     

# highlights dev versions in red

    Code
      highlight_version(c("1.0.0", "1.0.0.9000", "0.9000.0.9000", "1.0.0-rc"))
    Output
      [1] "1.0.0"                                        
      [2] "1.0.0.\033[31m9000\033[39m"                   
      [3] "0.\033[31m9000\033[39m.0.\033[31m9000\033[39m"
      [4] "1.0.0-rc"                                     

