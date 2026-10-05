# Writing system

Field Notes keeps a quiet reading column inside the Digital Nest. Articles use
the site body face for prose and JetBrains Mono for dates, code, and compact
technical labels. The article measure stays near 65 characters; diagrams and
wide tables may use the available viewport and scroll within their own bounds.

## Markdown conventions

- Use fenced code blocks with a language tag, such as ` ```ts `, so readers can
  identify the sample and use its copy control.
- Use a semantic `<figure>` with a descriptive image `alt` and `<figcaption>`
  for diagrams and screenshots. Keep the caption in source next to the image.
- Use Markdown tables for compact comparisons. They keep their own horizontal
  scroll area on small screens.
- Use Markdown quotes for cited passages. Use a short HTML `<aside
class="blog-callout" data-kind="note">` for a relevant note; `warning` and
  `important` change the border cue and must also be named in text.
- Use Astro's built-in GitHub-flavored Markdown tables and footnotes when they
  help compare facts or keep source details out of a paragraph. Footnote return
  links remain visible.
- Give every informative image useful alt text. Captions add context and do not
  replace the alt text.

## Code copy behavior

The static code remains readable without JavaScript. The syntax highlighter's
language metadata on `<pre>` supplies a label when present. A small page script
adds a copy button to each article code block. It announces success or gives a
manual-selection instruction if clipboard access fails. The control uses the
code element's text, so its label and announcement never enter copied output.

## Content boundaries

Do not add sample or placeholder posts to production content. Keep the index
empty until a real, source-checked article is ready. Prefer a diagram only when
it explains a real process, state, or relationship. Captions identify what the
reader should learn from it.
