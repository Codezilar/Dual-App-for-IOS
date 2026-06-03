import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';

type Profile = {
  id: string;
  name: string;
  url: string;
  color: string;
  incognito: boolean;
};

type Template = {
  name: string;
  url: string;
  color: string;
};

const STORAGE_KEY = 'dual-space-profiles';

const templates: Template[] = [
  { name: 'WhatsApp Web', url: 'https://web.whatsapp.com', color: '#1c9a5e' },
  { name: 'Telegram', url: 'https://web.telegram.org', color: '#2186d4' },
  { name: 'Gmail', url: 'https://mail.google.com', color: '#d44737' },
  { name: 'Instagram', url: 'https://www.instagram.com', color: '#c13584' },
  { name: 'X', url: 'https://x.com', color: '#222222' },
  { name: 'Facebook', url: 'https://m.facebook.com', color: '#316ff6' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com', color: '#0a66c2' }
];

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'https://www.google.com';
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const createProfile = (template: Template): Profile => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: template.name,
  url: template.url,
  color: template.color,
  incognito: false
});

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [name, setName] = useState(templates[0].name);
  const [url, setUrl] = useState(templates[0].url);
  const [incognito, setIncognito] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          setProfiles(JSON.parse(stored));
        } else {
          setProfiles([
            createProfile(templates[0]),
            createProfile({ ...templates[2], name: 'Gmail Work' })
          ]);
        }
      })
      .catch(() => setProfiles([]));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)).catch(() => {});
  }, [profiles]);

  const selectedTemplate = useMemo(() => templates[templateIndex], [templateIndex]);

  const selectTemplate = (index: number) => {
    const template = templates[index];
    setTemplateIndex(index);
    setName(template.name);
    setUrl(template.url);
  };

  const addProfile = () => {
    const trimmedName = name.trim() || selectedTemplate.name;
    setProfiles((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: trimmedName,
        url: normalizeUrl(url),
        color: selectedTemplate.color,
        incognito
      },
      ...current
    ]);
    setShowEditor(false);
  };

  const deleteProfile = (profile: Profile) => {
    Alert.alert('Delete clone?', profile.name, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setProfiles((current) => current.filter((item) => item.id !== profile.id))
      }
    ]);
  };

  if (activeProfile) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="auto" />
        <View style={styles.browserHeader}>
          <Pressable style={styles.backButton} onPress={() => setActiveProfile(null)}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <View style={styles.browserTitleWrap}>
            <Text numberOfLines={1} style={styles.browserTitle}>
              {activeProfile.name}
            </Text>
            <Text numberOfLines={1} style={styles.browserSubtitle}>
              {activeProfile.incognito ? 'Private session' : 'Shared WebView storage'}
            </Text>
          </View>
        </View>
        <WebView
          source={{ uri: activeProfile.url }}
          incognito={activeProfile.incognito}
          sharedCookiesEnabled={!activeProfile.incognito}
          thirdPartyCookiesEnabled
          startInLoadingState
          style={styles.webview}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dual Space</Text>
          <Text style={styles.subtitle}>React Native web clones for personal use</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => setShowEditor(true)}>
          <Text style={styles.primaryButtonText}>New</Text>
        </Pressable>
      </View>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => setActiveProfile(item)} onLongPress={() => deleteProfile(item)}>
            <View style={[styles.icon, { backgroundColor: item.color }]}>
              <Text style={styles.iconText}>{item.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={styles.cardSubtitle}>
                {item.url}
              </Text>
            </View>
            <Text style={styles.chevron}>Open</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No clones yet</Text>
            <Text style={styles.emptyText}>Create one web-app profile to begin testing.</Text>
          </View>
        }
      />

      <Modal visible={showEditor} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modal}>
          <SafeAreaView style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowEditor(false)}>
                <Text style={styles.modalAction}>Cancel</Text>
              </Pressable>
              <Text style={styles.modalTitle}>New Clone</Text>
              <Pressable onPress={addProfile}>
                <Text style={styles.modalAction}>Create</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionLabel}>Template</Text>
            <View style={styles.templateGrid}>
              {templates.map((template, index) => (
                <Pressable
                  key={template.name}
                  style={[styles.templateButton, templateIndex === index && styles.templateButtonActive]}
                  onPress={() => selectTemplate(index)}
                >
                  <Text numberOfLines={1} style={styles.templateText}>
                    {template.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Clone Details</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="Website"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <Pressable style={styles.toggleRow} onPress={() => setIncognito((value) => !value)}>
              <Text style={styles.toggleText}>Private in-memory session</Text>
              <View style={[styles.toggle, incognito && styles.toggleActive]}>
                <View style={[styles.toggleKnob, incognito && styles.toggleKnobActive]} />
              </View>
            </Pressable>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7f9'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  title: {
    color: '#15171a',
    fontSize: 30,
    fontWeight: '700'
  },
  subtitle: {
    color: '#69707a',
    fontSize: 14,
    marginTop: 4
  },
  primaryButton: {
    backgroundColor: '#15171a',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  },
  list: {
    gap: 10,
    padding: 16,
    paddingTop: 0
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e5e9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 72,
    padding: 12
  },
  icon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46
  },
  iconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800'
  },
  cardBody: {
    flex: 1,
    marginHorizontal: 12
  },
  cardTitle: {
    color: '#15171a',
    fontSize: 17,
    fontWeight: '700'
  },
  cardSubtitle: {
    color: '#69707a',
    fontSize: 13,
    marginTop: 3
  },
  chevron: {
    color: '#316ff6',
    fontSize: 14,
    fontWeight: '700'
  },
  empty: {
    alignItems: 'center',
    padding: 32
  },
  emptyTitle: {
    color: '#15171a',
    fontSize: 20,
    fontWeight: '700'
  },
  emptyText: {
    color: '#69707a',
    marginTop: 6,
    textAlign: 'center'
  },
  modal: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  modalInner: {
    flex: 1,
    padding: 20
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  modalAction: {
    color: '#316ff6',
    fontSize: 16,
    fontWeight: '700'
  },
  modalTitle: {
    color: '#15171a',
    fontSize: 18,
    fontWeight: '800'
  },
  sectionLabel: {
    color: '#69707a',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 14,
    textTransform: 'uppercase'
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  templateButton: {
    borderColor: '#d9dde3',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  templateButtonActive: {
    backgroundColor: '#eaf2ff',
    borderColor: '#316ff6'
  },
  templateText: {
    color: '#15171a',
    fontWeight: '700'
  },
  input: {
    backgroundColor: '#f6f7f9',
    borderColor: '#d9dde3',
    borderRadius: 8,
    borderWidth: 1,
    color: '#15171a',
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14
  },
  toggleText: {
    color: '#15171a',
    fontSize: 16,
    fontWeight: '700'
  },
  toggle: {
    backgroundColor: '#c8cdd4',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    padding: 3,
    width: 54
  },
  toggleActive: {
    backgroundColor: '#1c9a5e'
  },
  toggleKnob: {
    backgroundColor: '#ffffff',
    borderRadius: 13,
    height: 26,
    width: 26
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }]
  },
  browserHeader: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e5e9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 12
  },
  backButton: {
    backgroundColor: '#15171a',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  browserTitleWrap: {
    flex: 1,
    marginLeft: 12
  },
  browserTitle: {
    color: '#15171a',
    fontSize: 16,
    fontWeight: '800'
  },
  browserSubtitle: {
    color: '#69707a',
    fontSize: 12,
    marginTop: 2
  },
  webview: {
    flex: 1
  }
});
