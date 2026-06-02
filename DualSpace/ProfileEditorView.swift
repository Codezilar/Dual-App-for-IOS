import SwiftUI

struct ProfileEditorView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: ProfileStore

    @State private var selectedTemplate = WebAppTemplate.presets[0]
    @State private var name = WebAppTemplate.presets[0].name
    @State private var urlString = WebAppTemplate.presets[0].urlString
    @State private var color = WebAppTemplate.presets[0].color

    var body: some View {
        NavigationStack {
            Form {
                Section("Template") {
                    Picker("App", selection: $selectedTemplate) {
                        ForEach(WebAppTemplate.presets) { template in
                            Text(template.name).tag(template)
                        }
                    }
                    .onChange(of: selectedTemplate) { _, template in
                        name = template.name
                        urlString = template.urlString
                        color = template.color
                    }
                }

                Section("Clone") {
                    TextField("Name", text: $name)
                        .textInputAutocapitalization(.words)
                    TextField("Website", text: $urlString)
                        .keyboardType(.URL)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()

                    Picker("Color", selection: $color) {
                        ForEach(ProfileColor.allCases) { option in
                            Label(option.rawValue.capitalized, systemImage: "circle.fill")
                                .foregroundStyle(option.color)
                                .tag(option)
                        }
                    }
                }
            }
            .navigationTitle("New Clone")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Create") {
                        store.add(AppProfile(
                            name: name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? selectedTemplate.name : name,
                            urlString: urlString.normalizedWebURL,
                            colorName: color
                        ))
                        dismiss()
                    }
                    .disabled(urlString.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }
}

#Preview {
    ProfileEditorView()
        .environmentObject(ProfileStore())
}
