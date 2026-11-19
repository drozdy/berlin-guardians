## Mock data

The catalog runs on static JSON files that mimic API responses. They live in `public/data/` and are loaded with `fetch`.

```
public/data/
  games.json            # page 1 (10 items) + meta
  games-page-2.json     # page 2 (10 items)
  games-page-3.json     # page 3 (4 items)
  games-all.json        # all 24 items in a single list
  games/
    <slug>.json         # details for a single game (24 files)
```

### Games list

Each list file has a `data` array and a `meta` object.

```json
{
  "data": [
    {
      "slug": "moosweep",
      "name": "Moosweep",
      "category": "arcade",
      "price": "Free",
      "shortDescription": "You're a gourmet cow on a 9x9 field...",
      "rating": 4.9,
      "likesCount": 1520,
      "cardImage": {}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 24,
    "totalPages": 3,
    "appliedFilter": {
      "category": "all",
      "sort": "rating-desc"
    }
  }
}
```

| Field              | Type   | Description                                                                                 |
| ------------------ | ------ | ------------------------------------------------------------------------------------------- |
| `slug`             | string | Unique game id, also used in file names and routes                                          |
| `name`             | string | Display name                                                                                |
| `category`         | string | One of `puzzle`, `arcade`, `strategy`, `farm`, `adventure`, `simulation`, `casual`, `music` |
| `price`            | string | `"Free"` or a price like `"$2.99"`                                                          |
| `shortDescription` | string | One or two sentences for the catalog card                                                   |
| `rating`           | number | From 0 to 5                                                                                 |
| `likesCount`       | number | Total likes                                                                                 |
| `cardImage`        | object | Card image (see [Images](#images))                                                          |

### Game details

`games/<slug>.json` has a single `data` object.

```json
{
  "data": {
    "slug": "moosweep",
    "name": "Moosweep",
    "heroImage": {},
    "rating": 4.9,
    "likesCount": 1520,
    "isLikedByCurrentUser": false,
    "fullDescription": "Moosweep — a minesweeper-like game...",
    "specs": {
      "genre": "Arcade",
      "players": "Solo",
      "duration": "5-10 min",
      "price": "Free"
    },
    "topRecords": [
      {
        "position": 1,
        "playerName": "HappyCow",
        "score": 8100,
        "achievedAt": "2026-11-13T15:00:00Z"
      }
    ]
  }
}
```

| Field                  | Type    | Description                                                                                        |
| ---------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `heroImage`            | object  | Hero image (see [Images](#images))                                                                 |
| `isLikedByCurrentUser` | boolean | Whether the current user liked the game                                                            |
| `fullDescription`      | string  | Full description for the details page                                                              |
| `specs`                | object  | `genre`, `players`, `duration`, `price`                                                            |
| `topRecords`           | array   | Top results, each with `position`, `playerName`, `score` and `achievedAt` (ISO 8601). Can be empty |

### Images

`cardImage` and `heroImage` share the same shape and map directly to a `<picture>` element.

```json
{
  "alt": "Moosweep game artwork",
  "width": 460,
  "height": 215,
  "sources": [
    {
      "type": "image/webp",
      "srcset": "/assets/images/games/moosweep-card.webp 1x, /assets/images/games/moosweep-card@2x.webp 2x"
    }
  ],
  "fallback": "/assets/images/games/moosweep-card.jpg"
}
```

| Image | Size (1x) | File pattern                                                 |
| ----- | --------- | ------------------------------------------------------------ |
| Card  | 460x215   | `<slug>-card.webp`, `<slug>-card@2x.webp`, `<slug>-card.jpg` |
| Hero  | 1920x1080 | `<slug>-hero.webp`, `<slug>-hero@2x.webp`, `<slug>-hero.jpg` |

All images are stored in `public/assets/images/games/`.
