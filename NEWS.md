# blockr 0.0.2.9000

## Breaking changes
- Added new `category` to the registry. Now when a block is registered, you must pass a category parameter (which is used by the add block feature to sort blocks):

```r
register_block(
  constructor = new_tail_block,
  name = "tail block",
  description = "return last n rows",
  category = "transform",
  classes = c("tail_block", "transform_block"),
  input = "data.frame",
  output = "data.frame"
)

# Adding category to avoid 
# error: argument "category" is missing, with no default
```

## Feature
- Improved __add__ new block.

## Doc
- Improved `registry` and `getting started` vignettes.
- Add new `case studies` vignette to present blockr in various contexts.
- Refine GitHub readme.

## Fixes
- Fix issue in `handle_remove.block`: `vals$stack` wasn't correctly updated
when the last block was removed leading to wrong state.
- Loading spinner is now correctly hidden when the block visual is updated.

# blockr 0.0.2

## Breaking changes
- Change blocks and fields constructor names to `new_*_block` and `new_*_field`. For instance, for the select block,
users are now supposed to use `new_select_block()` and not `select_block`.
- Remove `data` from block constructor:

```r
new_select_block <- function(columns = character(), ...) {
  ...
}
```

## New features
- New validation functions: `validate_field()` and `validate_block()` to check that
values are consistent with data. These are used to then propagate any error to the user via JavaScript.
- Evaluation stops whenever a block isn't valid and the app should not crash.
- We can now instantiate block outside the stack with default parameter values (or use the old way with constructors):

```r
# New way
data_blk <- new_dataset_block(selected = "lab", package = "blockr.data")
select_blk <- new_select_block("STUDYID")

stack <- new_stack(data_blk, select_blk)

# Old way
stack <- new_stack(new_data_block, new_select_block)
```

# blockr 0.0.1.9000

* First prototype:
  - single stacks.
  - data block.
  - filter block.
  - Add/remove block from a stack.
