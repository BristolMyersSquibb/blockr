# blockr 0.0.2.9021

## Feature
- Improved `submit` feature for blocks. Now submit isn't added as a class but as a special block attribute. When you design a block, you can pass the `submit` parameter like so:

```r
new_super_block <- function(submit = NA, ...) {
  fields <- list()
  new_block(
    fields = fields,
    expr = quote(print("test")),
    submit = submit,
    ...,
    class = "my_block"
  )
}
```

When `submit = NA`, it will add a submit button but computations are blocked, as clicking on it is required. Internally, once the `input$submit` is clicked, the submit attribute is set to `TRUE`. This is useful when the stack is serialized, since this state is kept so that computations can be automatically re-triggered on restore. When `submit = TRUE`, a button is shown and the result is also computed. When `submit = FALSE`, no button is shown.

```r
# You can disable the submit button for filter block
serve_stack(new_stack(new_dataset_block(), new_filter_block(columns = "Time", submit = FALSE)))
serve_stack(new_stack(new_dataset_block(), new_filter_block(columns = "Time", submit = NA)))
# Simulate what happens when restoring a serialised stack
serve_stack(new_stack(new_dataset_block(), new_filter_block(columns = "Time", submit = TRUE)))
```

- Improved __add__ new block.
- Added new `category` to the registry. Now when a block is registered, you may pass a category parameter (which is used by the add block feature to sort blocks):

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
```

If not passed, the block will belong to `uncategorized` blocks (default).

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
