import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import { styles } from '../styles/styles';
import type { EducationalResourceItem } from '../data/educationalResources';

type Props = {
    heading: string;
    items: EducationalResourceItem[];
};

const EducationalResourceSection = ({ heading, items }: Props) => {
    const openUrl = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Unable to open link', 'This link cannot be opened on your device.');
            }
        } catch {
            Alert.alert('Unable to open link', 'Something went wrong opening the resource.');
        }
    };

    return (
        <View style={styles.educationalSectionCard}>
            <Text style={styles.educationalSectionHeading}>{heading}</Text>
            {items.map((item, index) => (
                <TouchableOpacity
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title}, opens CDC resource`}
                    onPress={() => openUrl(item.url)}
                    style={[
                        styles.educationalRow,
                        index === items.length - 1 && styles.educationalRowLast,
                    ]}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.educationalThumb}
                        resizeMode="cover"
                        accessibilityIgnoresInvertColors
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.educationalItemTitle}>{item.title}</Text>
                        <Text style={styles.educationalItemMeta}>
                            {item.resourceType} · {item.dateLabel}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default EducationalResourceSection;
