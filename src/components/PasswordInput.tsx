/**
 * PasswordInput — TextInput password avec toggle eye show/hide.
 *
 * Sprint C polish auth — réutilisable RegisterScreen + ResetPasswordConfirmScreen.
 *
 * Tap eye → bascule `secureTextEntry`. État local au composant. Reset à false
 * quand le composant remonte (sécurité : ne pas garder le mot de passe visible
 * entre écrans).
 */

import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import {
  brandColors,
  getInterFamily,
  neutralColors,
  radiusV1,
  space,
} from '../theme';

export type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry'>;

export default function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const Icon = visible ? EyeOff : Eye;

  return (
    <View style={styles.wrap}>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        secureTextEntry={!visible}
        autoCapitalize="none"
      />
      <Pressable
        style={styles.eye}
        onPress={() => setVisible((v) => !v)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        <Icon size={20} color={neutralColors.textMuted} strokeWidth={1.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  input: {
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1.md,
    borderWidth: 1.5,
    borderColor: neutralColors.borderVisible,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    paddingRight: 48, // place pour l'icône
    fontFamily: getInterFamily('400'),
    fontSize: 17,
    color: brandColors.deep,
  },
  eye: {
    position: 'absolute',
    right: space[3],
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
