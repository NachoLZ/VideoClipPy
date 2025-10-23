# Icon Replacements for All Components

## Emoji to Iconify Icon Mapping

| Emoji | Iconify Icon | Color | Component |
|-------|--------------|-------|-----------|
| 🎬 | mdi:movie-edit | white | App.jsx (Header) |
| 📤 | mdi:cloud-upload | white | UploadSection (Step 1) |
| 📹 | mdi:video | purple-600 | UploadSection (Video) |
| 📄 | mdi:file-document | blue-600 | UploadSection (TXT) |
| ⬆️ | mdi:upload | - | UploadSection (Button) |
| 📄 | mdi:file-document-outline | white | TranscriptPreview (Step 2) |
| 🎯 | mdi:target | white | WordSelection (Step 3) |
| 📁 | mdi:folder-open | - | WordSelection (Choose File) |
| 📂 | mdi:folder | - | WordSelection (Select existing) |
| 📹 | mdi:video | - | WordSelection (Clips) |
| ✅ | mdi:check-circle | - | WordSelection (Add) |
| ❌ | mdi:close-circle | - | WordSelection (Cancel) |
| ℹ️ | mdi:information | - | WordSelection (Modal) |
| 📋 | mdi:clipboard-list | white | HighlightsList (Step 4) |
| 🎵 | mdi:music | white | MusicSelection (Step 5) |
| 🎶 | mdi:music-note | white | MusicList (Step 6) |
| ⚙️ | mdi:cog | white | ProcessSection (Step 7) |
| 🎥 | mdi:movie | - | ProcessSection (Button) |
| ✅ | mdi:check-circle | white | ResultSection (Step 8) |
| ⬇️ | mdi:download | - | ResultSection (Download) |
| 🔄 | mdi:refresh | - | ResultSection (Reset) |

## Icon Usage Examples

```jsx
// In gradient background (white icon)
<Icon icon="mdi:movie-edit" className="text-white text-2xl" />

// In colored background (colored icon)
<Icon icon="mdi:video" className="text-purple-600 text-3xl" />

// In button (inherit color)
<Icon icon="mdi:upload" className="text-lg" />
```

