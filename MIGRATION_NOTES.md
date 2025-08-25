# Migration Notes

## Expo AV Deprecation

### Current Status
- `expo-av` is deprecated and will be removed in SDK 54
- New packages: `expo-audio` and `expo-video` are available
- **Issue**: The new packages have different APIs that are not yet fully compatible

### Affected Files
- `src/roles/teacher/screens/components/subjects/VideoPlayer.tsx`
- `src/roles/teacher/screens/components/subjects/VideoUploadModal.tsx`

### Current Solution
- Using `expo-av` with `@ts-ignore` comments
- Added TODO comments for future migration
- Warning is suppressed but functionality works

### Migration Plan
1. **Wait for stable API** - The new `expo-video` package needs stable API
2. **Update imports** - Replace `expo-av` with `expo-video`
3. **Update component props** - Adjust to new API
4. **Remove @ts-ignore** - Once API is stable

### References
- [Expo Audio Documentation](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Expo Video Documentation](https://docs.expo.dev/versions/latest/sdk/video/)

### Notes
- The warning is just informational and doesn't break functionality
- Video upload and playback continue to work normally
- Migration will be done when the new packages have stable APIs





