# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "Baruch College Department of Information Systems and Statistics" [level=1] [ref=e3]
    - heading "Programming Self-Assessment" [level=2] [ref=e4]
  - generic [ref=e11]:
    - progressbar "Progress bar" [ref=e12]:
      - list [ref=e15]:
        - listitem [ref=e16] [cursor=pointer]
        - listitem [ref=e20] [cursor=pointer]
        - listitem [ref=e24] [cursor=pointer]
      - generic "Page 3 of 3" [ref=e29]
    - generic [ref=e34]:
      - generic [ref=e35]:
        - generic [ref=e36]: Your Previous Experience
        - generic [ref=e39]:
          - generic [ref=e41]: Have you taken a previous computer science course? *
          - generic [ref=e43]:
            - switch "Have you taken a previous computer science course?" [checked=mixed] [ref=e44]
            - generic [ref=e46]: "No"
            - generic [ref=e48]: "Yes"
      - generic [ref=e50]:
        - button "Previous" [ref=e53] [cursor=pointer]
        - button "Complete" [ref=e56] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e62] [cursor=pointer]:
    - img [ref=e63]
  - alert [ref=e66]
```