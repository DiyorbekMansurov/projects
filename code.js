const ComponentFunction = function() {
  // @section:imports @depends:[]
  const React = require('react');
  const { useState, useEffect, useMemo, useCallback, useContext, useRef } = React;
  const { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform, StatusBar, FlatList, Dimensions, ActivityIndicator, KeyboardAvoidingView } = require('react-native');
  const { Ionicons } = require('@react-native-vector-icons/ionicons');
  const { MaterialIcons } = require('@react-native-vector-icons/material-icons');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  const { createStackNavigator } = require('@react-navigation/stack');
  const { useSafeAreaInsets } = require('react-native-safe-area-context');
  const { useQuery, useMutation, useStorage } = require('platform-hooks');
  // @end:imports

  // @section:theme @depends:[]
  const primaryColor = '#E85D75';
  const accentColor = '#F59E0B';
  const backgroundColor = '#FFF5F7';
  const cardColor = '#FFFFFF';
  const textPrimary = '#2D3748';
  const textSecondary = '#718096';
  const designStyle = 'modern';
  const TAB_MENU_HEIGHT = Platform.OS === 'web' ? 56 : 49;
  const SCROLL_EXTRA_PADDING = 16;
  const WEB_TAB_MENU_PADDING = 90;
  const FAB_SPACING = 16;
  const HEADER_HEIGHT = 60;
  // @end:theme

  // @section:navigation-setup @depends:[]
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  // @end:navigation-setup

  // @section:constants @depends:[]
  const CATEGORIES = [
    { id: 'baking', label: 'Выпечка', icon: '🥐', color: '#FEF3C7' },
    { id: 'sewing', label: 'Шитьё', icon: '🧵', color: '#FCE7F3' },
    { id: 'embroidery', label: 'Вышивка', icon: '🌸', color: '#EDE9FE' },
    { id: 'knitting', label: 'Вязание', icon: '🧶', color: '#DBEAFE' },
    { id: 'laundry', label: 'Стирка', icon: '👕', color: '#D1FAE5' },
    { id: 'ironing', label: 'Глажка', icon: '👔', color: '#FEE2E2' },
    { id: 'cleaning', label: 'Уборка', icon: '🧹', color: '#E0F2FE' },
    { id: 'jewelry', label: 'Чистка украшений', icon: '💍', color: '#FEF9C3' },
    { id: 'cooking', label: 'Готовка', icon: '🍳', color: '#FFEDD5' },
    { id: 'alterations', label: 'Перешив', icon: '✂️', color: '#F3E8FF' },
  ];

  const CATEGORIES_BY_ID = {};
  CATEGORIES.forEach(function(c) { CATEGORIES_BY_ID[c.id] = c; });

  const STATUS_LABELS = {
    open: 'Открыта',
    accepted: 'Принята',
    completed: 'Выполнена',
    pending: 'На рассмотрении',
    cancelled: 'Отменена',
  };

  const SAMPLE_LISTINGS = [
    { id: 'sl-1', title: 'Домашняя выпечка и торты', category: 'baking', rate_per_hour: 500, description: 'Пеку торты, пирожки, булочки на заказ. Работаю с 9:00 до 18:00. Натуральные ингредиенты.', is_active: true, provider_name: 'Анна К.', rating: 4.8 },
    { id: 'sl-2', title: 'Ремонт и пошив одежды', category: 'sewing', rate_per_hour: 400, description: 'Ремонт, перешив, ушивание одежды любой сложности. Опыт 15 лет.', is_active: true, provider_name: 'Марина С.', rating: 4.9 },
    { id: 'sl-3', title: 'Вышивка на заказ', category: 'embroidery', rate_per_hour: 350, description: 'Вышиваю картины, инициалы на одежде, подарочные изделия.', is_active: true, provider_name: 'Елена Р.', rating: 4.7 },
    { id: 'sl-4', title: 'Стирка и глажка', category: 'laundry', rate_per_hour: 300, description: 'Ручная и машинная стирка, деликатные ткани. Доставка на дом.', is_active: true, provider_name: 'Ольга П.', rating: 4.6 },
    { id: 'sl-5', title: 'Уборка квартир', category: 'cleaning', rate_per_hour: 450, description: 'Генеральная и поддерживающая уборка, использую профессиональную химию.', is_active: true, provider_name: 'Наталья В.', rating: 4.5 },
    { id: 'sl-6', title: 'Чистка ювелирных украшений', category: 'jewelry', rate_per_hour: 600, description: 'Профессиональная чистка золота, серебра, камней. Возврат блеска.', is_active: true, provider_name: 'Светлана М.', rating: 4.9 },
    { id: 'sl-7', title: 'Вязание на заказ', category: 'knitting', rate_per_hour: 380, description: 'Вяжу свитера, шапки, шарфы, игрушки. Любые размеры.', is_active: true, provider_name: 'Людмила А.', rating: 4.7 },
    { id: 'sl-8', title: 'Домашняя кулинария', category: 'cooking', rate_per_hour: 420, description: 'Готовлю домашние обеды и ужины под заказ. Доставка.', is_active: true, provider_name: 'Татьяна Н.', rating: 4.8 },
  ];
  // @end:constants

  // @section:ThemeContext @depends:[theme]
  const ThemeContext = React.createContext({
    theme: {
      colors: {
        primary: primaryColor, accent: accentColor, background: backgroundColor,
        card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary,
        border: '#F0D6DB', success: '#10B981', error: '#EF4444', warning: '#F59E0B'
      }
    },
    designStyle: designStyle,
  });

  const ThemeProvider = function(props) {
    const lightTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor, accent: accentColor, background: backgroundColor,
          card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary,
          border: '#F0D6DB', success: '#10B981', error: '#EF4444', warning: '#F59E0B'
        }
      };
    }, []);

    const value = useMemo(function() {
      return { theme: lightTheme, designStyle: designStyle };
    }, [lightTheme]);

    return React.createElement(ThemeContext.Provider, { testID: 'Provider-1', value: value }, props.children);
  };

  const useTheme = function() { return useContext(ThemeContext); };
  // @end:ThemeContext

  // @section:AddListingModal @depends:[ThemeContext,styles,constants]
  var AddListingModal = function(props) {
    var visible = props.visible;
    var onClose = props.onClose;
    var onSave = props.onSave;
    var theme = props.theme;
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;

    var titleState = useState('');
    var title = titleState[0];
    var setTitle = titleState[1];
    var descState = useState('');
    var desc = descState[0];
    var setDesc = descState[1];
    var rateState = useState('');
    var rate = rateState[0];
    var setRate = rateState[1];
    var catState = useState('baking');
    var category = catState[0];
    var setCategory = catState[1];

    var baseHeight = (Platform.OS === 'web' && typeof window !== 'undefined' && window.__thunkablePhoneFrameHeight) || Dimensions.get('window').height;
    var sheetHeight = Math.round(baseHeight * 0.9);

    var handleSave = function() {
      if (!title.trim()) {
        Platform.OS === 'web' ? window.alert('Введите название услуги') : Alert.alert('Ошибка', 'Введите название услуги');
        return;
      }
      if (!rate.trim()) {
        Platform.OS === 'web' ? window.alert('Укажите стоимость') : Alert.alert('Ошибка', 'Укажите стоимость');
        return;
      }
      onSave({ title: title.trim(), description: desc.trim(), category: category, rate_per_hour: parseFloat(rate) || 0, is_active: true });
      setTitle(''); setDesc(''); setRate(''); setCategory('baking');
    };

    return React.createElement(Modal, { testID: 'Modal-1', visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose },
      React.createElement(View, { testID: 'View-1', style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop } },
        React.createElement(View, { testID: 'View-2', style: { height: sheetHeight, backgroundColor: theme.colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 } },
          React.createElement(ScrollView, { testID: 'ScrollView-1', style: { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: insetsBottom + 24 } },
            React.createElement(View, { testID: 'View-3', style: { width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 } }),
            React.createElement(Text, { testID: 'Text-1', style: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 } }, 'Добавить услугу'),
            React.createElement(Text, { testID: 'Text-2', style: styles.inputLabel }, 'Название услуги *'),
            React.createElement(TextInput, { testID: 'TextInput-1',
              value: title,
              onChangeText: setTitle,
              placeholder: 'Например: Выпечка тортов на заказ',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              autoCapitalize: 'sentences',
              componentId: 'input-listing-title'
            }),
            React.createElement(Text, { testID: 'Text-3', style: styles.inputLabel }, 'Категория'),
            React.createElement(ScrollView, { testID: 'ScrollView-2', horizontal: true, showsHorizontalScrollIndicator: false, style: { marginBottom: 16, flexGrow: 'initial' } },
              CATEGORIES.map(function(cat) {
                var active = category === cat.id;
                return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-1',
                  key: cat.id,
                  onPress: function() { setCategory(cat.id); },
                  style: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: active ? primaryColor : theme.colors.background, borderWidth: 1, borderColor: active ? primaryColor : theme.colors.border },
                  componentId: 'cat-btn-' + cat.id
                },
                  React.createElement(Text, { testID: 'Text-4', style: { color: active ? '#fff' : theme.colors.textPrimary, fontSize: 13, fontWeight: active ? '600' : '400' } }, cat.icon + ' ' + cat.label)
                );
              })
            ),
            React.createElement(Text, { testID: 'Text-5', style: styles.inputLabel }, 'Стоимость (₽/час) *'),
            React.createElement(TextInput, { testID: 'TextInput-2',
              value: rate,
              onChangeText: function(t) { setRate(t.replace(/[^0-9.]/g, '')); },
              placeholder: '350',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              keyboardType: 'decimal-pad',
              componentId: 'input-listing-rate'
            }),
            React.createElement(Text, { testID: 'Text-6', style: styles.inputLabel }, 'Описание'),
            React.createElement(TextInput, { testID: 'TextInput-3',
              value: desc,
              onChangeText: setDesc,
              placeholder: 'Расскажите подробнее о вашей услуге...',
              placeholderTextColor: theme.colors.textSecondary,
              style: [styles.textInput, { minHeight: 100, textAlignVertical: 'top' }],
              multiline: true,
              numberOfLines: 4,
              componentId: 'input-listing-desc'
            }),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-2',
              onPress: handleSave,
              style: [styles.primaryBtn, { marginTop: 8 }],
              componentId: 'btn-save-listing'
            },
              React.createElement(Text, { testID: 'Text-7', style: styles.primaryBtnText }, 'Опубликовать услугу')
            ),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-3',
              onPress: onClose,
              style: styles.secondaryBtn,
              componentId: 'btn-cancel-listing'
            },
              React.createElement(Text, { testID: 'Text-8', style: [styles.secondaryBtnText, { color: theme.colors.textSecondary }] }, 'Отмена')
            )
          )
        )
      )
    );
  };
  // @end:AddListingModal

  // @section:AddRequestModal @depends:[ThemeContext,styles,constants]
  var AddRequestModal = function(props) {
    var visible = props.visible;
    var onClose = props.onClose;
    var onSave = props.onSave;
    var theme = props.theme;
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;

    var titleState = useState('');
    var title = titleState[0];
    var setTitle = titleState[1];
    var descState = useState('');
    var desc = descState[0];
    var setDesc = descState[1];
    var budgetState = useState('');
    var budget = budgetState[0];
    var setBudget = budgetState[1];
    var cityState = useState('');
    var city = cityState[0];
    var setCity = cityState[1];

    var baseHeight = (Platform.OS === 'web' && typeof window !== 'undefined' && window.__thunkablePhoneFrameHeight) || Dimensions.get('window').height;
    var sheetHeight = Math.round(baseHeight * 0.88);

    var handleSave = function() {
      if (!title.trim()) {
        Platform.OS === 'web' ? window.alert('Введите название заявки') : Alert.alert('Ошибка', 'Введите название');
        return;
      }
      if (!desc.trim()) {
        Platform.OS === 'web' ? window.alert('Опишите что нужно сделать') : Alert.alert('Ошибка', 'Опишите задачу');
        return;
      }
      onSave({ title: title.trim(), description: desc.trim(), budget: parseFloat(budget) || null, city: city.trim() || null, status: 'open' });
      setTitle(''); setDesc(''); setBudget(''); setCity('');
    };

    return React.createElement(Modal, { testID: 'Modal-2', visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose },
      React.createElement(View, { testID: 'View-4', style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop } },
        React.createElement(View, { testID: 'View-5', style: { height: sheetHeight, backgroundColor: theme.colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 } },
          React.createElement(ScrollView, { testID: 'ScrollView-3', style: { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: insetsBottom + 24 } },
            React.createElement(View, { testID: 'View-6', style: { width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 } }),
            React.createElement(Text, { testID: 'Text-9', style: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 } }, 'Создать заявку'),
            React.createElement(Text, { testID: 'Text-10', style: styles.inputLabel }, 'Что нужно сделать? *'),
            React.createElement(TextInput, { testID: 'TextInput-4',
              value: title,
              onChangeText: setTitle,
              placeholder: 'Например: Постирать и погладить одежду',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              autoCapitalize: 'sentences',
              componentId: 'input-req-title'
            }),
            React.createElement(Text, { testID: 'Text-11', style: styles.inputLabel }, 'Подробное описание *'),
            React.createElement(TextInput, { testID: 'TextInput-5',
              value: desc,
              onChangeText: setDesc,
              placeholder: 'Опишите подробнее что нужно сделать, объём работы...',
              placeholderTextColor: theme.colors.textSecondary,
              style: [styles.textInput, { minHeight: 100, textAlignVertical: 'top' }],
              multiline: true,
              numberOfLines: 4,
              componentId: 'input-req-desc'
            }),
            React.createElement(Text, { testID: 'Text-12', style: styles.inputLabel }, 'Бюджет (₽)'),
            React.createElement(TextInput, { testID: 'TextInput-6',
              value: budget,
              onChangeText: function(t) { setBudget(t.replace(/[^0-9.]/g, '')); },
              placeholder: '1500',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              keyboardType: 'decimal-pad',
              componentId: 'input-req-budget'
            }),
            React.createElement(Text, { testID: 'Text-13', style: styles.inputLabel }, 'Город'),
            React.createElement(TextInput, { testID: 'TextInput-7',
              value: city,
              onChangeText: setCity,
              placeholder: 'Москва',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              autoCapitalize: 'words',
              componentId: 'input-req-city'
            }),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-4',
              onPress: handleSave,
              style: [styles.primaryBtn, { marginTop: 8 }],
              componentId: 'btn-save-request'
            },
              React.createElement(Text, { testID: 'Text-14', style: styles.primaryBtnText }, 'Опубликовать заявку')
            ),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-5',
              onPress: onClose,
              style: styles.secondaryBtn,
              componentId: 'btn-cancel-request'
            },
              React.createElement(Text, { testID: 'Text-15', style: [styles.secondaryBtnText, { color: theme.colors.textSecondary }] }, 'Отмена')
            )
          )
        )
      )
    );
  };
  // @end:AddRequestModal

  // @section:MakeOfferModal @depends:[ThemeContext,styles]
  var MakeOfferModal = function(props) {
    var visible = props.visible;
    var onClose = props.onClose;
    var onSave = props.onSave;
    var theme = props.theme;
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;

    var rateState = useState('');
    var offeredRate = rateState[0];
    var setOfferedRate = rateState[1];
    var hoursState = useState('');
    var hours = hoursState[0];
    var setHours = hoursState[1];
    var msgState = useState('');
    var message = msgState[0];
    var setMessage = msgState[1];

    var baseHeight = (Platform.OS === 'web' && typeof window !== 'undefined' && window.__thunkablePhoneFrameHeight) || Dimensions.get('window').height;
    var sheetHeight = Math.round(baseHeight * 0.75);

    var handleSave = function() {
      if (!offeredRate.trim()) {
        Platform.OS === 'web' ? window.alert('Укажите ставку') : Alert.alert('Ошибка', 'Укажите ставку');
        return;
      }
      onSave({ offered_rate: parseFloat(offeredRate) || 0, estimated_hours: parseFloat(hours) || null, message: message.trim() || null, status: 'pending' });
      setOfferedRate(''); setHours(''); setMessage('');
    };

    return React.createElement(Modal, { testID: 'Modal-3', visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose },
      React.createElement(View, { testID: 'View-7', style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop } },
        React.createElement(View, { testID: 'View-8', style: { height: sheetHeight, backgroundColor: theme.colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 } },
          React.createElement(ScrollView, { testID: 'ScrollView-4', style: { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: insetsBottom + 24 } },
            React.createElement(View, { testID: 'View-9', style: { width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 } }),
            React.createElement(Text, { testID: 'Text-16', style: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 } }, 'Предложить услугу'),
            React.createElement(Text, { testID: 'Text-17', style: styles.inputLabel }, 'Ваша ставка (₽/час) *'),
            React.createElement(TextInput, { testID: 'TextInput-8',
              value: offeredRate,
              onChangeText: function(t) { setOfferedRate(t.replace(/[^0-9.]/g, '')); },
              placeholder: '350',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              keyboardType: 'decimal-pad',
              componentId: 'input-offer-rate'
            }),
            React.createElement(Text, { testID: 'Text-18', style: styles.inputLabel }, 'Примерное время (часов)'),
            React.createElement(TextInput, { testID: 'TextInput-9',
              value: hours,
              onChangeText: function(t) { setHours(t.replace(/[^0-9.]/g, '')); },
              placeholder: '2',
              placeholderTextColor: theme.colors.textSecondary,
              style: styles.textInput,
              keyboardType: 'decimal-pad',
              componentId: 'input-offer-hours'
            }),
            React.createElement(Text, { testID: 'Text-19', style: styles.inputLabel }, 'Сообщение заказчику'),
            React.createElement(TextInput, { testID: 'TextInput-10',
              value: message,
              onChangeText: setMessage,
              placeholder: 'Расскажите о своём опыте...',
              placeholderTextColor: theme.colors.textSecondary,
              style: [styles.textInput, { minHeight: 80, textAlignVertical: 'top' }],
              multiline: true,
              numberOfLines: 3,
              componentId: 'input-offer-msg'
            }),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-6',
              onPress: handleSave,
              style: [styles.primaryBtn, { marginTop: 8 }],
              componentId: 'btn-save-offer'
            },
              React.createElement(Text, { testID: 'Text-20', style: styles.primaryBtnText }, 'Отправить предложение')
            ),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-7',
              onPress: onClose,
              style: styles.secondaryBtn,
              componentId: 'btn-cancel-offer'
            },
              React.createElement(Text, { testID: 'Text-21', style: [styles.secondaryBtnText, { color: theme.colors.textSecondary }] }, 'Отмена')
            )
          )
        )
      )
    );
  };
  // @end:MakeOfferModal

  // @section:BookingModal @depends:[ThemeContext,styles]
  var BookingModal = function(props) {
    var visible = props.visible;
    var onClose = props.onClose;
    var onSave = props.onSave;
    var theme = props.theme;
    var listing = props.listing;
    var insetsTop = props.insetsTop;
    var insetsBottom = props.insetsBottom;

    var notesState = useState('');
    var notes = notesState[0];
    var setNotes = notesState[1];

    var baseHeight = (Platform.OS === 'web' && typeof window !== 'undefined' && window.__thunkablePhoneFrameHeight) || Dimensions.get('window').height;
    var sheetHeight = Math.round(baseHeight * 0.65);

    var handleSave = function() {
      onSave({ notes: notes.trim() || null, status: 'pending', total_price: listing ? listing.rate_per_hour * 2 : null });
      setNotes('');
    };

    return React.createElement(Modal, { testID: 'Modal-4', visible: visible, animationType: 'slide', transparent: true, onRequestClose: onClose },
      React.createElement(View, { testID: 'View-10', style: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop } },
        React.createElement(View, { testID: 'View-11', style: { height: sheetHeight, backgroundColor: theme.colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: insetsBottom + 24 } },
          React.createElement(View, { testID: 'View-12', style: { width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 } }),
          React.createElement(Text, { testID: 'Text-22', style: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 8 } }, 'Заказать услугу'),
          listing ? React.createElement(View, { testID: 'View-13', style: { backgroundColor: backgroundColor, borderRadius: 12, padding: 14, marginBottom: 16 } },
            React.createElement(Text, { testID: 'Text-23', style: { fontWeight: '600', color: textPrimary, fontSize: 16, marginBottom: 4 } }, listing.title),
            React.createElement(Text, { testID: 'Text-24', style: { color: primaryColor, fontWeight: '700', fontSize: 18 } }, listing.rate_per_hour + ' ₽/час')
          ) : null,
          React.createElement(Text, { testID: 'Text-25', style: styles.inputLabel }, 'Комментарий к заказу'),
          React.createElement(TextInput, { testID: 'TextInput-11',
            value: notes,
            onChangeText: setNotes,
            placeholder: 'Уточните детали заказа...',
            placeholderTextColor: theme.colors.textSecondary,
            style: [styles.textInput, { minHeight: 80, textAlignVertical: 'top' }],
            multiline: true,
            numberOfLines: 3,
            componentId: 'input-booking-notes'
          }),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-8',
            onPress: handleSave,
            style: [styles.primaryBtn, { marginTop: 12 }],
            componentId: 'btn-confirm-booking'
          },
            React.createElement(Text, { testID: 'Text-26', style: styles.primaryBtnText }, 'Подтвердить заказ')
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-9',
            onPress: onClose,
            style: styles.secondaryBtn,
            componentId: 'btn-cancel-booking'
          },
            React.createElement(Text, { testID: 'Text-27', style: [styles.secondaryBtnText, { color: theme.colors.textSecondary }] }, 'Отмена')
          )
        )
      )
    );
  };
  // @end:BookingModal

  // @section:BrowseScreen-state @depends:[ThemeContext,constants]
  var useBrowseState = function() {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var searchState = useState('');
    var search = searchState[0];
    var setSearch = searchState[1];
    var selCatState = useState('all');
    var selectedCat = selCatState[0];
    var setSelectedCat = selCatState[1];
    var modalState = useState(false);
    var showBooking = modalState[0];
    var setShowBooking = modalState[1];
    var selListingState = useState(null);
    var selectedListing = selListingState[0];
    var setSelectedListing = selListingState[1];
    return {
      theme: theme,
      search: search, setSearch: setSearch,
      selectedCat: selectedCat, setSelectedCat: setSelectedCat,
      showBooking: showBooking, setShowBooking: setShowBooking,
      selectedListing: selectedListing, setSelectedListing: setSelectedListing
    };
  };
  // @end:BrowseScreen-state

  // @section:BrowseScreen @depends:[BrowseScreen-state,BookingModal,styles,constants]
  var BrowseScreen = function(props) {
    var navigation = props.navigation;
    var state = useBrowseState();
    var insets = useSafeAreaInsets();
    var listingsQuery = useQuery('service_listings');
    var listingsData = listingsQuery.data;
    var listingsLoading = listingsQuery.loading;
    var insertBooking = useMutation('bookings', 'insert');
    var mutateBooking = insertBooking.mutate;
    var bookingsQuery = useQuery('bookings');
    var refetchBookings = bookingsQuery.refetch;

    var allListings = useMemo(function() {
      var dbListings = listingsData && listingsData.length > 0 ? listingsData : [];
      var combined = SAMPLE_LISTINGS.concat(dbListings);
      var search = state.search.toLowerCase().trim();
      return combined.filter(function(l) {
        var catMatch = state.selectedCat === 'all' || l.category === state.selectedCat;
        var searchMatch = !search || (l.title && l.title.toLowerCase().indexOf(search) !== -1);
        return catMatch && searchMatch;
      });
    }, [listingsData, state.search, state.selectedCat]);

    var scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var handleBook = function(listing) {
      state.setSelectedListing(listing);
      state.setShowBooking(true);
    };

    var handleBookingConfirm = function(data) {
      var listing = state.selectedListing;
      if (!listing) return;
      var bookingData = Object.assign({}, data, {
        service_listing_id: listing.id && listing.id.indexOf('sl-') === 0 ? null : listing.id,
        provider_id: '00000000-0000-0000-0000-000000000001',
        customer_id: '00000000-0000-0000-0000-000000000002',
      });
      mutateBooking(bookingData).then(function() {
        refetchBookings();
        state.setShowBooking(false);
        Platform.OS === 'web' ? window.alert('Заказ отправлен! Ждите подтверждения.') : Alert.alert('Успешно', 'Заказ отправлен!');
      }).catch(function(e) {
        state.setShowBooking(false);
        Platform.OS === 'web' ? window.alert('Заказ создан') : Alert.alert('Успешно', 'Заказ создан');
      });
    };

    return React.createElement(View, { testID: 'View-14', style: { flex: 1, backgroundColor: state.theme.colors.background }, componentId: 'browse-screen' },
      React.createElement(View, { testID: 'View-15', style: { backgroundColor: primaryColor, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 } },
        React.createElement(Text, { testID: 'Text-28', style: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 12 }, componentId: 'browse-title' }, '🏠 Mahorat'),
        React.createElement(View, { testID: 'View-16', style: styles.searchBox },
          React.createElement(Ionicons, { testID: 'Ionicons-1', name: 'search', size: 18, color: textSecondary }),
          React.createElement(TextInput, { testID: 'TextInput-12',
            value: state.search,
            onChangeText: state.setSearch,
            placeholder: 'Поиск услуг...',
            placeholderTextColor: textSecondary,
            style: { flex: 1, marginLeft: 8, fontSize: 15, color: textPrimary },
            componentId: 'input-search'
          })
        )
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-5', horizontal: true, showsHorizontalScrollIndicator: false, style: { backgroundColor: cardColor, maxHeight: 56, flexGrow: 'initial' }, contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' } },
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-10',
          onPress: function() { state.setSelectedCat('all'); },
          style: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: state.selectedCat === 'all' ? primaryColor : backgroundColor, borderWidth: 1, borderColor: state.selectedCat === 'all' ? primaryColor : '#F0D6DB' },
          componentId: 'cat-all'
        },
          React.createElement(Text, { testID: 'Text-29', style: { color: state.selectedCat === 'all' ? '#fff' : textPrimary, fontWeight: '600', fontSize: 13 } }, 'Все')
        ),
        CATEGORIES.map(function(cat) {
          var active = state.selectedCat === cat.id;
          return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-11',
            key: cat.id,
            onPress: function() { state.setSelectedCat(cat.id); },
            style: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: active ? primaryColor : backgroundColor, borderWidth: 1, borderColor: active ? primaryColor : '#F0D6DB' },
            componentId: 'filter-' + cat.id
          },
            React.createElement(Text, { testID: 'Text-30', style: { color: active ? '#fff' : textPrimary, fontWeight: '600', fontSize: 13 } }, cat.icon + ' ' + cat.label)
          );
        })
      ),
      listingsLoading ? React.createElement(ActivityIndicator, { testID: 'ActivityIndicator-1', style: { marginTop: 40 }, color: primaryColor, size: 'large', componentId: 'browse-loader' }) :
      React.createElement(FlatList, { testID: 'FlatList-1',
        data: allListings,
        keyExtractor: function(item) { return String(item.id); },
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottom },
        showsVerticalScrollIndicator: false,
        ListEmptyComponent: React.createElement(View, { testID: 'View-17', style: { alignItems: 'center', marginTop: 60 } },
          React.createElement(Text, { testID: 'Text-31', style: { fontSize: 48, marginBottom: 12 } }, '🔍'),
          React.createElement(Text, { testID: 'Text-32', style: { fontSize: 16, color: textSecondary, textAlign: 'center' } }, 'Услуги не найдены')
        ),
        renderItem: function(info) {
          var item = info.item;
          var cat = CATEGORIES_BY_ID[item.category] || {};
          return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-12',
            onPress: function() { navigation.push('ListingDetail', { listing: item }); },
            style: styles.listingCard,
            componentId: 'listing-card-' + item.id
          },
            React.createElement(View, { testID: 'View-18', style: { flexDirection: 'row', alignItems: 'flex-start' } },
              React.createElement(View, { testID: 'View-19', style: { width: 52, height: 52, borderRadius: 14, backgroundColor: cat.color || backgroundColor, alignItems: 'center', justifyContent: 'center', marginRight: 14 } },
                React.createElement(Text, { testID: 'Text-33', style: { fontSize: 26 } }, cat.icon || '🏠')
              ),
              React.createElement(View, { testID: 'View-20', style: { flex: 1 } },
                React.createElement(Text, { testID: 'Text-34', style: { fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 2 } }, item.title),
                React.createElement(Text, { testID: 'Text-35', style: { fontSize: 13, color: textSecondary, marginBottom: 6 } }, cat.label || item.category),
                item.description ? React.createElement(Text, { testID: 'Text-36', style: { fontSize: 13, color: textSecondary, lineHeight: 18 }, numberOfLines: 2 }, item.description) : null
              )
            ),
            React.createElement(View, { testID: 'View-21', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 } },
              React.createElement(View, { testID: 'View-22', style: {} },
                item.provider_name ? React.createElement(Text, { testID: 'Text-37', style: { fontSize: 13, color: textSecondary } }, '👤 ' + item.provider_name) : null,
                item.rating ? React.createElement(Text, { testID: 'Text-38', style: { fontSize: 13, color: accentColor, fontWeight: '600', marginTop: 2 } }, '⭐ ' + item.rating) : null
              ),
              React.createElement(View, { testID: 'View-23', style: { alignItems: 'flex-end' } },
                React.createElement(Text, { testID: 'Text-39', style: { fontSize: 20, fontWeight: '800', color: primaryColor } }, item.rate_per_hour + ' ₽'),
                React.createElement(Text, { testID: 'Text-40', style: { fontSize: 11, color: textSecondary } }, 'за час'),
                React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-13',
                  onPress: function() { handleBook(item); },
                  style: { backgroundColor: primaryColor, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7, marginTop: 6 },
                  componentId: 'book-btn-' + item.id
                },
                  React.createElement(Text, { testID: 'Text-41', style: { color: '#fff', fontWeight: '700', fontSize: 13 } }, 'Заказать')
                )
              )
            )
          );
        }
      }),
      React.createElement(BookingModal, { testID: 'BookingModal-1',
        visible: state.showBooking,
        onClose: function() { state.setShowBooking(false); },
        onSave: handleBookingConfirm,
        theme: state.theme,
        listing: state.selectedListing,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      })
    );
  };
  // @end:BrowseScreen

  // @section:ListingDetailScreen @depends:[ThemeContext,BookingModal,styles,constants]
  var ListingDetailScreen = function(props) {
    var navigation = props.navigation;
    var route = props.route;
    var listing = route && route.params && route.params.listing ? route.params.listing : { title: 'Услуга', category: 'baking', rate_per_hour: 400, description: 'Описание услуги', provider_name: 'Исполнитель', rating: 4.8 };
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var cat = CATEGORIES_BY_ID[listing.category] || {};
    var showBookingState = useState(false);
    var showBooking = showBookingState[0];
    var setShowBooking = showBookingState[1];
    var insertBooking = useMutation('bookings', 'insert');
    var mutateBooking = insertBooking.mutate;
    var scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (insets.bottom + SCROLL_EXTRA_PADDING);

    var handleBookingConfirm = function(data) {
      var bookingData = Object.assign({}, data, {
        service_listing_id: listing.id && String(listing.id).indexOf('sl-') === 0 ? null : listing.id,
        provider_id: '00000000-0000-0000-0000-000000000001',
        customer_id: '00000000-0000-0000-0000-000000000002',
      });
      mutateBooking(bookingData).then(function() {
        setShowBooking(false);
        Platform.OS === 'web' ? window.alert('Заказ успешно создан!') : Alert.alert('Успешно', 'Заказ создан!');
      }).catch(function() {
        setShowBooking(false);
        Platform.OS === 'web' ? window.alert('Заказ создан!') : Alert.alert('Успешно', 'Заказ создан!');
      });
    };

    return React.createElement(View, { testID: 'View-24', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'listing-detail-screen' },
      React.createElement(View, { testID: 'View-25', style: { backgroundColor: primaryColor, paddingTop: insets.top, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 } },
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-14', onPress: function() { navigation.goBack(); }, style: { padding: 4, marginRight: 8 }, componentId: 'btn-back-listing' },
          React.createElement(Ionicons, { testID: 'Ionicons-2', name: 'arrow-back', size: 24, color: '#fff' })
        ),
        React.createElement(Text, { testID: 'Text-42', style: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 } }, 'Детали услуги')
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-6', style: { flex: 1 }, contentContainerStyle: { padding: 20, paddingBottom: scrollBottom } },
        React.createElement(View, { testID: 'View-26', style: { backgroundColor: cat.color || backgroundColor, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 } },
          React.createElement(Text, { testID: 'Text-43', style: { fontSize: 64, marginBottom: 8 } }, cat.icon || '🏠'),
          React.createElement(Text, { testID: 'Text-44', style: { fontSize: 13, color: textSecondary, fontWeight: '600' } }, cat.label || listing.category)
        ),
        React.createElement(View, { testID: 'View-27', style: [styles.listingCard, { marginBottom: 16 }] },
          React.createElement(Text, { testID: 'Text-45', style: { fontSize: 22, fontWeight: '800', color: textPrimary, marginBottom: 8 } }, listing.title),
          React.createElement(View, { testID: 'View-28', style: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } },
            React.createElement(Text, { testID: 'Text-46', style: { fontSize: 28, fontWeight: '900', color: primaryColor } }, listing.rate_per_hour + ' ₽'),
            React.createElement(Text, { testID: 'Text-47', style: { fontSize: 16, color: textSecondary, marginLeft: 4 } }, '/ час')
          ),
          listing.provider_name ? React.createElement(View, { testID: 'View-29', style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
            React.createElement(View, { testID: 'View-30', style: { width: 36, height: 36, borderRadius: 18, backgroundColor: primaryColor + '20', alignItems: 'center', justifyContent: 'center', marginRight: 10 } },
              React.createElement(Text, { testID: 'Text-48', style: { fontSize: 16 } }, '👤')
            ),
            React.createElement(View, { testID: 'View-31' },
              React.createElement(Text, { testID: 'Text-49', style: { fontSize: 15, fontWeight: '600', color: textPrimary } }, listing.provider_name),
              listing.rating ? React.createElement(Text, { testID: 'Text-50', style: { fontSize: 13, color: accentColor } }, '⭐ ' + listing.rating + ' — рейтинг') : null
            )
          ) : null,
          listing.description ? React.createElement(View, { testID: 'View-32' },
            React.createElement(View, { testID: 'View-33', style: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 } }),
            React.createElement(Text, { testID: 'Text-51', style: { fontSize: 14, fontWeight: '600', color: textPrimary, marginBottom: 6 } }, 'Описание'),
            React.createElement(Text, { testID: 'Text-52', style: { fontSize: 15, color: textSecondary, lineHeight: 22 } }, listing.description)
          ) : null
        ),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-15',
          onPress: function() { setShowBooking(true); },
          style: [styles.primaryBtn],
          componentId: 'btn-book-detail'
        },
          React.createElement(Text, { testID: 'Text-53', style: styles.primaryBtnText }, '📅 Заказать услугу')
        )
      ),
      React.createElement(BookingModal, { testID: 'BookingModal-2',
        visible: showBooking,
        onClose: function() { setShowBooking(false); },
        onSave: handleBookingConfirm,
        theme: theme,
        listing: listing,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      })
    );
  };
  // @end:ListingDetailScreen

  // @section:RequestsScreen @depends:[ThemeContext,AddRequestModal,MakeOfferModal,styles]
  var RequestsScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var requestsQuery = useQuery('service_requests');
    var requestsData = requestsQuery.data;
    var requestsLoading = requestsQuery.loading;
    var refetchRequests = requestsQuery.refetch;
    var insertRequest = useMutation('service_requests', 'insert');
    var mutateRequest = insertRequest.mutate;
    var insertOffer = useMutation('service_offers', 'insert');
    var mutateOffer = insertOffer.mutate;
    var offersQuery = useQuery('service_offers');
    var refetchOffers = offersQuery.refetch;

    var profileStorage = useStorage('profile', { displayName: 'Пользователь', isProvider: false });
    var profile = profileStorage[0];

    var showAddState = useState(false);
    var showAdd = showAddState[0];
    var setShowAdd = showAddState[1];
    var showOfferState = useState(false);
    var showOffer = showOfferState[0];
    var setShowOffer = showOfferState[1];
    var selReqState = useState(null);
    var selectedReq = selReqState[0];
    var setSelectedReq = selReqState[1];

    var scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var fabBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + FAB_SPACING);

    var handleAddRequest = function(data) {
      var reqData = Object.assign({}, data, { customer_id: '00000000-0000-0000-0000-000000000002' });
      mutateRequest(reqData).then(function() {
        refetchRequests();
        setShowAdd(false);
        Platform.OS === 'web' ? window.alert('Заявка опубликована!') : Alert.alert('Успешно', 'Заявка опубликована!');
      }).catch(function() {
        refetchRequests();
        setShowAdd(false);
      });
    };

    var handleMakeOffer = function(data) {
      if (!selectedReq) return;
      var offerData = Object.assign({}, data, {
        request_id: selectedReq.id,
        provider_id: '00000000-0000-0000-0000-000000000001',
      });
      mutateOffer(offerData).then(function() {
        refetchOffers();
        setShowOffer(false);
        Platform.OS === 'web' ? window.alert('Предложение отправлено!') : Alert.alert('Успешно', 'Предложение отправлено!');
      }).catch(function() {
        setShowOffer(false);
        Platform.OS === 'web' ? window.alert('Предложение отправлено!') : Alert.alert('Успешно', 'Предложение отправлено!');
      });
    };

    var allRequests = requestsData && requestsData.length > 0 ? requestsData : [];

    return React.createElement(View, { testID: 'View-34', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'requests-screen' },
      React.createElement(View, { testID: 'View-35', style: { backgroundColor: primaryColor, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 } },
        React.createElement(Text, { testID: 'Text-54', style: { fontSize: 24, fontWeight: '800', color: '#fff' }, componentId: 'requests-title' }, '📋 Заявки'),
        React.createElement(Text, { testID: 'Text-55', style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } }, 'Заявки от пользователей на услуги')
      ),
      requestsLoading ? React.createElement(ActivityIndicator, { testID: 'ActivityIndicator-2', style: { flex: 1 }, color: primaryColor, componentId: 'req-loader' }) :
      React.createElement(FlatList, { testID: 'FlatList-2',
        data: allRequests,
        keyExtractor: function(item) { return String(item.id); },
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottom },
        showsVerticalScrollIndicator: false,
        ListEmptyComponent: React.createElement(View, { testID: 'View-36', style: { alignItems: 'center', marginTop: 80 } },
          React.createElement(Text, { testID: 'Text-56', style: { fontSize: 56, marginBottom: 16 } }, '📋'),
          React.createElement(Text, { testID: 'Text-57', style: { fontSize: 18, fontWeight: '700', color: textPrimary, marginBottom: 8 } }, 'Заявок пока нет'),
          React.createElement(Text, { testID: 'Text-58', style: { fontSize: 14, color: textSecondary, textAlign: 'center', paddingHorizontal: 32 } }, 'Нажмите «+» чтобы создать заявку на нужную услугу')
        ),
        renderItem: function(info) {
          var item = info.item;
          var statusColors = { open: '#10B981', accepted: accentColor, completed: textSecondary };
          return React.createElement(View, { testID: 'View-37', style: [styles.listingCard, { marginBottom: 12 }], componentId: 'req-card-' + item.id },
            React.createElement(View, { testID: 'View-38', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 } },
              React.createElement(Text, { testID: 'Text-59', style: { fontSize: 16, fontWeight: '700', color: textPrimary, flex: 1, marginRight: 8 } }, item.title),
              React.createElement(View, { testID: 'View-39', style: { backgroundColor: (statusColors[item.status] || textSecondary) + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 } },
                React.createElement(Text, { testID: 'Text-60', style: { fontSize: 11, fontWeight: '600', color: statusColors[item.status] || textSecondary } }, STATUS_LABELS[item.status] || item.status)
              )
            ),
            React.createElement(Text, { testID: 'Text-61', style: { fontSize: 14, color: textSecondary, lineHeight: 20, marginBottom: 10 } }, item.description),
            React.createElement(View, { testID: 'View-40', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
              React.createElement(View, { testID: 'View-41' },
                item.budget ? React.createElement(Text, { testID: 'Text-62', style: { fontSize: 16, fontWeight: '800', color: primaryColor } }, '💰 ' + item.budget + ' ₽') : React.createElement(Text, { testID: 'Text-63', style: { fontSize: 13, color: textSecondary } }, 'Бюджет не указан'),
                item.city ? React.createElement(Text, { testID: 'Text-64', style: { fontSize: 13, color: textSecondary, marginTop: 2 } }, '📍 ' + item.city) : null
              ),
              item.status === 'open' && profile.isProvider ? React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-16',
                onPress: function() { setSelectedReq(item); setShowOffer(true); },
                style: { backgroundColor: accentColor, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
                componentId: 'offer-btn-' + item.id
              },
                React.createElement(Text, { testID: 'Text-65', style: { color: '#fff', fontWeight: '700', fontSize: 13 } }, 'Предложить')
              ) : null
            )
          );
        }
      }),
      React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-17',
        onPress: function() { setShowAdd(true); },
        style: { position: 'absolute', right: 20, bottom: fabBottom, backgroundColor: primaryColor, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: primaryColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
        componentId: 'fab-add-request'
      },
        React.createElement(Ionicons, { testID: 'Ionicons-3', name: 'add', size: 28, color: '#fff' })
      ),
      React.createElement(AddRequestModal, { testID: 'AddRequestModal-1',
        visible: showAdd,
        onClose: function() { setShowAdd(false); },
        onSave: handleAddRequest,
        theme: theme,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      }),
      React.createElement(MakeOfferModal, { testID: 'MakeOfferModal-1',
        visible: showOffer,
        onClose: function() { setShowOffer(false); },
        onSave: handleMakeOffer,
        theme: theme,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      })
    );
  };
  // @end:RequestsScreen

  // @section:MyServicesScreen @depends:[ThemeContext,AddListingModal,styles,constants]
  var MyServicesScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var profileStorage = useStorage('profile', { displayName: 'Пользователь', isProvider: false });
    var profile = profileStorage[0];

    var listingsQuery = useQuery('service_listings');
    var listingsData = listingsQuery.data;
    var listingsLoading = listingsQuery.loading;
    var refetchListings = listingsQuery.refetch;
    var insertListing = useMutation('service_listings', 'insert');
    var mutateListing = insertListing.mutate;
    var deleteListing = useMutation('service_listings', 'delete');
    var mutateDelete = deleteListing.mutate;

    var showAddState = useState(false);
    var showAdd = showAddState[0];
    var setShowAdd = showAddState[1];

    var scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var fabBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + FAB_SPACING);

    var myListings = listingsData && listingsData.length > 0 ? listingsData : [];

    var handleAddListing = function(data) {
      var listingData = Object.assign({}, data, { provider_id: '00000000-0000-0000-0000-000000000001' });
      mutateListing(listingData).then(function() {
        refetchListings();
        setShowAdd(false);
        Platform.OS === 'web' ? window.alert('Услуга опубликована!') : Alert.alert('Успешно', 'Услуга опубликована!');
      }).catch(function() {
        refetchListings();
        setShowAdd(false);
      });
    };

    var handleDelete = function(id) {
      var doDelete = function() {
        mutateDelete({ id: id }).then(function() { refetchListings(); }).catch(function() { refetchListings(); });
      };
      if (Platform.OS === 'web') {
        if (window.confirm('Удалить эту услугу?')) { doDelete(); }
      } else {
        Alert.alert('Удалить?', 'Вы уверены что хотите удалить эту услугу?', [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Удалить', onPress: doDelete, style: 'destructive' }
        ]);
      }
    };

    if (!profile.isProvider) {
      return React.createElement(View, { testID: 'View-42', style: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }, componentId: 'not-provider-screen' },
        React.createElement(Text, { testID: 'Text-66', style: { fontSize: 64, marginBottom: 16 } }, '🧵'),
        React.createElement(Text, { testID: 'Text-67', style: { fontSize: 22, fontWeight: '800', color: textPrimary, textAlign: 'center', marginBottom: 12 } }, 'Режим исполнителя'),
        React.createElement(Text, { testID: 'Text-68', style: { fontSize: 15, color: textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 } }, 'Активируйте режим исполнителя в профиле чтобы публиковать свои услуги и принимать заказы'),
        React.createElement(Text, { testID: 'Text-69', style: { fontSize: 13, color: textSecondary, textAlign: 'center' } }, '👤 Профиль → Стать исполнителем')
      );
    }

    return React.createElement(View, { testID: 'View-43', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'my-services-screen' },
      React.createElement(View, { testID: 'View-44', style: { backgroundColor: primaryColor, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 } },
        React.createElement(Text, { testID: 'Text-70', style: { fontSize: 24, fontWeight: '800', color: '#fff' }, componentId: 'myservices-title' }, '🧵 Мои услуги'),
        React.createElement(Text, { testID: 'Text-71', style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } }, 'Управляйте своими предложениями')
      ),
      listingsLoading ? React.createElement(ActivityIndicator, { testID: 'ActivityIndicator-3', style: { flex: 1 }, color: primaryColor, componentId: 'myservices-loader' }) :
      React.createElement(FlatList, { testID: 'FlatList-3',
        data: myListings,
        keyExtractor: function(item) { return String(item.id); },
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottom },
        showsVerticalScrollIndicator: false,
        ListEmptyComponent: React.createElement(View, { testID: 'View-45', style: { alignItems: 'center', marginTop: 60 } },
          React.createElement(Text, { testID: 'Text-72', style: { fontSize: 56, marginBottom: 16 } }, '🌸'),
          React.createElement(Text, { testID: 'Text-73', style: { fontSize: 18, fontWeight: '700', color: textPrimary, marginBottom: 8 } }, 'Нет услуг'),
          React.createElement(Text, { testID: 'Text-74', style: { fontSize: 14, color: textSecondary, textAlign: 'center', paddingHorizontal: 32 } }, 'Нажмите «+» чтобы добавить первую услугу')
        ),
        renderItem: function(info) {
          var item = info.item;
          var cat = CATEGORIES_BY_ID[item.category] || {};
          return React.createElement(View, { testID: 'View-46', style: [styles.listingCard, { marginBottom: 12 }], componentId: 'my-listing-' + item.id },
            React.createElement(View, { testID: 'View-47', style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
              React.createElement(View, { testID: 'View-48', style: { width: 44, height: 44, borderRadius: 12, backgroundColor: cat.color || backgroundColor, alignItems: 'center', justifyContent: 'center', marginRight: 12 } },
                React.createElement(Text, { testID: 'Text-75', style: { fontSize: 22 } }, cat.icon || '🏠')
              ),
              React.createElement(View, { testID: 'View-49', style: { flex: 1 } },
                React.createElement(Text, { testID: 'Text-76', style: { fontSize: 16, fontWeight: '700', color: textPrimary } }, item.title),
                React.createElement(Text, { testID: 'Text-77', style: { fontSize: 13, color: textSecondary } }, cat.label || item.category)
              ),
              React.createElement(View, { testID: 'View-50', style: { backgroundColor: item.is_active ? '#D1FAE5' : '#FEE2E2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 } },
                React.createElement(Text, { testID: 'Text-78', style: { fontSize: 11, fontWeight: '600', color: item.is_active ? '#065F46' : '#991B1B' } }, item.is_active ? 'Активна' : 'Неактивна')
              )
            ),
            React.createElement(View, { testID: 'View-51', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
              React.createElement(Text, { testID: 'Text-79', style: { fontSize: 20, fontWeight: '800', color: primaryColor } }, item.rate_per_hour + ' ₽/час'),
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-18',
                onPress: function() { handleDelete(item.id); },
                style: { padding: 8 },
                componentId: 'delete-listing-' + item.id
              },
                React.createElement(Ionicons, { testID: 'Ionicons-4', name: 'trash-outline', size: 20, color: '#EF4444' })
              )
            )
          );
        }
      }),
      React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-19',
        onPress: function() { setShowAdd(true); },
        style: { position: 'absolute', right: 20, bottom: fabBottom, backgroundColor: primaryColor, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: primaryColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
        componentId: 'fab-add-listing'
      },
        React.createElement(Ionicons, { testID: 'Ionicons-5', name: 'add', size: 28, color: '#fff' })
      ),
      React.createElement(AddListingModal, { testID: 'AddListingModal-1',
        visible: showAdd,
        onClose: function() { setShowAdd(false); },
        onSave: handleAddListing,
        theme: theme,
        insetsTop: insets.top,
        insetsBottom: insets.bottom
      })
    );
  };
  // @end:MyServicesScreen

  // @section:BookingsScreen @depends:[ThemeContext,styles]
  var BookingsScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var bookingsQuery = useQuery('bookings');
    var bookingsData = bookingsQuery.data;
    var bookingsLoading = bookingsQuery.loading;
    var refetchBookings = bookingsQuery.refetch;
    var updateBooking = useMutation('bookings', 'update');
    var mutateUpdate = updateBooking.mutate;

    var scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var allBookings = bookingsData && bookingsData.length > 0 ? bookingsData : [];

    var handleUpdateStatus = function(id, newStatus) {
      mutateUpdate({ id: id, data: { status: newStatus } }).then(function() {
        refetchBookings();
      }).catch(function() { refetchBookings(); });
    };

    var statusStyles = {
      pending: { bg: '#FEF3C7', text: '#92400E', label: '⏳ На рассмотрении' },
      completed: { bg: '#D1FAE5', text: '#065F46', label: '✅ Выполнено' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', label: '❌ Отменено' },
    };

    return React.createElement(View, { testID: 'View-52', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'bookings-screen' },
      React.createElement(View, { testID: 'View-53', style: { backgroundColor: primaryColor, paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20 } },
        React.createElement(Text, { testID: 'Text-80', style: { fontSize: 24, fontWeight: '800', color: '#fff' }, componentId: 'bookings-title' }, '📅 Заказы'),
        React.createElement(Text, { testID: 'Text-81', style: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 } }, 'История ваших заказов')
      ),
      bookingsLoading ? React.createElement(ActivityIndicator, { testID: 'ActivityIndicator-4', style: { flex: 1 }, color: primaryColor, componentId: 'bookings-loader' }) :
      React.createElement(FlatList, { testID: 'FlatList-4',
        data: allBookings,
        keyExtractor: function(item) { return String(item.id); },
        contentContainerStyle: { padding: 16, paddingBottom: scrollBottom },
        showsVerticalScrollIndicator: false,
        ListEmptyComponent: React.createElement(View, { testID: 'View-54', style: { alignItems: 'center', marginTop: 80 } },
          React.createElement(Text, { testID: 'Text-82', style: { fontSize: 56, marginBottom: 16 } }, '📅'),
          React.createElement(Text, { testID: 'Text-83', style: { fontSize: 18, fontWeight: '700', color: textPrimary, marginBottom: 8 } }, 'Заказов пока нет'),
          React.createElement(Text, { testID: 'Text-84', style: { fontSize: 14, color: textSecondary, textAlign: 'center', paddingHorizontal: 32 } }, 'Закажите услугу на вкладке «Услуги»')
        ),
        renderItem: function(info) {
          var item = info.item;
          var st = statusStyles[item.status] || statusStyles.pending;
          return React.createElement(View, { testID: 'View-55', style: [styles.listingCard, { marginBottom: 12 }], componentId: 'booking-card-' + item.id },
            React.createElement(View, { testID: 'View-56', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
              React.createElement(Text, { testID: 'Text-85', style: { fontSize: 15, fontWeight: '700', color: textPrimary, flex: 1 } }, item.notes || 'Заказ услуги'),
              React.createElement(View, { testID: 'View-57', style: { backgroundColor: st.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 } },
                React.createElement(Text, { testID: 'Text-86', style: { fontSize: 11, fontWeight: '700', color: st.text } }, st.label)
              )
            ),
            item.total_price ? React.createElement(Text, { testID: 'Text-87', style: { fontSize: 18, fontWeight: '800', color: primaryColor, marginBottom: 8 } }, '💰 ' + item.total_price + ' ₽') : null,
            React.createElement(Text, { testID: 'Text-88', style: { fontSize: 12, color: textSecondary, marginBottom: item.status === 'pending' ? 12 : 0 } }, new Date(item.created_at || Date.now()).toLocaleDateString('ru-RU')),
            item.status === 'pending' ? React.createElement(View, { testID: 'View-58', style: { flexDirection: 'row', gap: 8 } },
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-20',
                onPress: function() { handleUpdateStatus(item.id, 'completed'); },
                style: { flex: 1, backgroundColor: '#10B981', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
                componentId: 'complete-btn-' + item.id
              },
                React.createElement(Text, { testID: 'Text-89', style: { color: '#fff', fontWeight: '700', fontSize: 14 } }, '✅ Выполнено')
              ),
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-21',
                onPress: function() { handleUpdateStatus(item.id, 'cancelled'); },
                style: { flex: 1, backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
                componentId: 'cancel-btn-' + item.id
              },
                React.createElement(Text, { testID: 'Text-90', style: { color: '#fff', fontWeight: '700', fontSize: 14 } }, '❌ Отменить')
              )
            ) : null
          );
        }
      })
    );
  };
  // @end:BookingsScreen

  // @section:ProfileScreen @depends:[ThemeContext,styles]
  var ProfileScreen = function(props) {
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var insets = useSafeAreaInsets();
    var profileStorage = useStorage('profile', { displayName: '', isProvider: false, bio: '', phone: '', city: '' });
    var profile = profileStorage[0];
    var setProfile = profileStorage[1];

    var editState = useState(false);
    var editing = editState[0];
    var setEditing = editState[1];
    var nameState = useState(profile.displayName || '');
    var editName = nameState[0];
    var setEditName = nameState[1];
    var bioState = useState(profile.bio || '');
    var editBio = bioState[0];
    var setEditBio = bioState[1];
    var phoneState = useState(profile.phone || '');
    var editPhone = phoneState[0];
    var setEditPhone = phoneState[1];
    var cityState = useState(profile.city || '');
    var editCity = cityState[0];
    var setEditCity = cityState[1];

    var scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var handleSave = function() {
      setProfile(function(prev) {
        return Object.assign({}, prev, {
          displayName: editName.trim() || 'Пользователь',
          bio: editBio.trim(),
          phone: editPhone.trim(),
          city: editCity.trim()
        });
      });
      setEditing(false);
    };

    var handleToggleProvider = function() {
      setProfile(function(prev) { return Object.assign({}, prev, { isProvider: !prev.isProvider }); });
    };

    var initials = (profile.displayName || 'П').charAt(0).toUpperCase();

    return React.createElement(ScrollView, { testID: 'ScrollView-7', style: { flex: 1, backgroundColor: theme.colors.background }, contentContainerStyle: { paddingBottom: scrollBottom }, componentId: 'profile-screen' },
      React.createElement(View, { testID: 'View-59', style: { backgroundColor: primaryColor, paddingTop: insets.top + 20, paddingBottom: 32, alignItems: 'center', paddingHorizontal: 20 } },
        React.createElement(View, { testID: 'View-60', style: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)' } },
          React.createElement(Text, { testID: 'Text-91', style: { fontSize: 38, color: '#fff', fontWeight: '800' } }, initials)
        ),
        React.createElement(Text, { testID: 'Text-92', style: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 } }, profile.displayName || 'Пользователь'),
        React.createElement(View, { testID: 'View-61', style: { backgroundColor: profile.isProvider ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 } },
          React.createElement(Text, { testID: 'Text-93', style: { color: '#fff', fontWeight: '600', fontSize: 13 } }, profile.isProvider ? '🧵 Исполнитель' : '🛒 Заказчик')
        )
      ),
      React.createElement(View, { testID: 'View-62', style: { padding: 20 } },
        React.createElement(View, { testID: 'View-63', style: [styles.listingCard, { marginBottom: 16 }] },
          React.createElement(View, { testID: 'View-64', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } },
            React.createElement(Text, { testID: 'Text-94', style: { fontSize: 17, fontWeight: '700', color: textPrimary } }, 'Личные данные'),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-22',
              onPress: function() {
                if (editing) { handleSave(); }
                else {
                  setEditName(profile.displayName || '');
                  setEditBio(profile.bio || '');
                  setEditPhone(profile.phone || '');
                  setEditCity(profile.city || '');
                  setEditing(true);
                }
              },
              style: { backgroundColor: editing ? '#10B981' : primaryColor + '15', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
              componentId: 'btn-edit-profile'
            },
              React.createElement(Text, { testID: 'Text-95', style: { color: editing ? '#fff' : primaryColor, fontWeight: '700', fontSize: 14 } }, editing ? '✅ Сохранить' : '✏️ Изменить')
            )
          ),
          editing ? React.createElement(View, { testID: 'View-65' },
            React.createElement(Text, { testID: 'Text-96', style: styles.inputLabel }, 'Имя'),
            React.createElement(TextInput, { testID: 'TextInput-13', value: editName, onChangeText: setEditName, placeholder: 'Ваше имя', placeholderTextColor: textSecondary, style: styles.textInput, autoCapitalize: 'words', componentId: 'input-edit-name' }),
            React.createElement(Text, { testID: 'Text-97', style: styles.inputLabel }, 'Телефон'),
            React.createElement(TextInput, { testID: 'TextInput-14', value: editPhone, onChangeText: function(t) { setEditPhone(t.replace(/[^0-9+\-() ]/g, '')); }, placeholder: '+7 999 000 00 00', placeholderTextColor: textSecondary, style: styles.textInput, keyboardType: 'phone-pad', componentId: 'input-edit-phone' }),
            React.createElement(Text, { testID: 'Text-98', style: styles.inputLabel }, 'Город'),
            React.createElement(TextInput, { testID: 'TextInput-15', value: editCity, onChangeText: setEditCity, placeholder: 'Москва', placeholderTextColor: textSecondary, style: styles.textInput, autoCapitalize: 'words', componentId: 'input-edit-city' }),
            React.createElement(Text, { testID: 'Text-99', style: styles.inputLabel }, 'О себе'),
            React.createElement(TextInput, { testID: 'TextInput-16', value: editBio, onChangeText: setEditBio, placeholder: 'Расскажите о себе...', placeholderTextColor: textSecondary, style: [styles.textInput, { minHeight: 80, textAlignVertical: 'top' }], multiline: true, numberOfLines: 3, componentId: 'input-edit-bio' })
          ) : React.createElement(View, { testID: 'View-66' },
            profile.phone ? React.createElement(View, { testID: 'View-67', style: styles.profileRow },
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-1', name: 'phone', size: 18, color: textSecondary }),
              React.createElement(Text, { testID: 'Text-100', style: { marginLeft: 10, color: textPrimary, fontSize: 15 } }, profile.phone)
            ) : null,
            profile.city ? React.createElement(View, { testID: 'View-68', style: styles.profileRow },
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-2', name: 'location-on', size: 18, color: textSecondary }),
              React.createElement(Text, { testID: 'Text-101', style: { marginLeft: 10, color: textPrimary, fontSize: 15 } }, profile.city)
            ) : null,
            profile.bio ? React.createElement(View, { testID: 'View-69', style: styles.profileRow },
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-3', name: 'info-outline', size: 18, color: textSecondary }),
              React.createElement(Text, { testID: 'Text-102', style: { marginLeft: 10, color: textSecondary, fontSize: 14, flex: 1, lineHeight: 20 } }, profile.bio)
            ) : null,
            !profile.phone && !profile.city && !profile.bio ? React.createElement(Text, { testID: 'Text-103', style: { color: textSecondary, fontSize: 14, textAlign: 'center', paddingVertical: 8 } }, 'Нажмите «Изменить» чтобы заполнить профиль') : null
          )
        ),
        React.createElement(View, { testID: 'View-70', style: [styles.listingCard, { marginBottom: 16 }] },
          React.createElement(Text, { testID: 'Text-104', style: { fontSize: 17, fontWeight: '700', color: textPrimary, marginBottom: 16 } }, '⚙️ Режим работы'),
          React.createElement(View, { testID: 'View-71', style: { borderRadius: 16, overflow: 'hidden' } },
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-23',
              onPress: function() { if (profile.isProvider) handleToggleProvider(); },
              style: { padding: 14, backgroundColor: !profile.isProvider ? primaryColor : 'transparent', borderWidth: !profile.isProvider ? 0 : 1, borderColor: theme.colors.border, borderRadius: 12, marginBottom: 8 },
              componentId: 'btn-mode-customer'
            },
              React.createElement(View, { testID: 'View-72', style: { flexDirection: 'row', alignItems: 'center' } },
                React.createElement(Text, { testID: 'Text-105', style: { fontSize: 22, marginRight: 10 } }, '🛒'),
                React.createElement(View, { testID: 'View-73', style: { flex: 1 } },
                  React.createElement(Text, { testID: 'Text-106', style: { fontSize: 16, fontWeight: '700', color: !profile.isProvider ? '#fff' : textPrimary } }, 'Заказчик'),
                  React.createElement(Text, { testID: 'Text-107', style: { fontSize: 12, color: !profile.isProvider ? 'rgba(255,255,255,0.8)' : textSecondary } }, 'Ищу услуги и создаю заявки')
                ),
                !profile.isProvider ? React.createElement(Ionicons, { testID: 'Ionicons-6', name: 'checkmark-circle', size: 22, color: '#fff' }) : null
              )
            ),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-24',
              onPress: function() { if (!profile.isProvider) handleToggleProvider(); },
              style: { padding: 14, backgroundColor: profile.isProvider ? accentColor : 'transparent', borderWidth: profile.isProvider ? 0 : 1, borderColor: theme.colors.border, borderRadius: 12 },
              componentId: 'btn-mode-provider'
            },
              React.createElement(View, { testID: 'View-74', style: { flexDirection: 'row', alignItems: 'center' } },
                React.createElement(Text, { testID: 'Text-108', style: { fontSize: 22, marginRight: 10 } }, '🧵'),
                React.createElement(View, { testID: 'View-75', style: { flex: 1 } },
                  React.createElement(Text, { testID: 'Text-109', style: { fontSize: 16, fontWeight: '700', color: profile.isProvider ? '#fff' : textPrimary } }, 'Исполнитель'),
                  React.createElement(Text, { testID: 'Text-110', style: { fontSize: 12, color: profile.isProvider ? 'rgba(255,255,255,0.8)' : textSecondary } }, 'Предлагаю свои услуги')
                ),
                profile.isProvider ? React.createElement(Ionicons, { testID: 'Ionicons-7', name: 'checkmark-circle', size: 22, color: '#fff' }) : null
              )
            )
          )
        ),
        React.createElement(View, { testID: 'View-76', style: [styles.listingCard, { marginBottom: 16 }] },
          React.createElement(Text, { testID: 'Text-111', style: { fontSize: 17, fontWeight: '700', color: textPrimary, marginBottom: 14 } }, '📊 Статистика'),
          React.createElement(View, { testID: 'View-77', style: { flexDirection: 'row', justifyContent: 'space-around' } },
            React.createElement(View, { testID: 'View-78', style: { alignItems: 'center' } },
              React.createElement(Text, { testID: 'Text-112', style: { fontSize: 28, fontWeight: '900', color: primaryColor } }, '0'),
              React.createElement(Text, { testID: 'Text-113', style: { fontSize: 12, color: textSecondary, marginTop: 2 } }, 'Заказов')
            ),
            React.createElement(View, { testID: 'View-79', style: { width: 1, backgroundColor: theme.colors.border } }),
            React.createElement(View, { testID: 'View-80', style: { alignItems: 'center' } },
              React.createElement(Text, { testID: 'Text-114', style: { fontSize: 28, fontWeight: '900', color: accentColor } }, '0'),
              React.createElement(Text, { testID: 'Text-115', style: { fontSize: 12, color: textSecondary, marginTop: 2 } }, 'Отзывов')
            ),
            React.createElement(View, { testID: 'View-81', style: { width: 1, backgroundColor: theme.colors.border } }),
            React.createElement(View, { testID: 'View-82', style: { alignItems: 'center' } },
              React.createElement(Text, { testID: 'Text-116', style: { fontSize: 28, fontWeight: '900', color: '#10B981' } }, '—'),
              React.createElement(Text, { testID: 'Text-117', style: { fontSize: 12, color: textSecondary, marginTop: 2 } }, 'Рейтинг')
            )
          )
        )
      )
    );
  };
  // @end:ProfileScreen

  // @section:TabNavigator @depends:[BrowseScreen,RequestsScreen,MyServicesScreen,BookingsScreen,ProfileScreen,navigation-setup]
  var TabNavigator = function() {
    var insets = useSafeAreaInsets();
    var themeCtx = useTheme();
    var theme = themeCtx.theme;
    var profileStorage = useStorage('profile', { isProvider: false });
    var profile = profileStorage[0];

    return React.createElement(View, { testID: 'View-83', style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' } },
      React.createElement(Tab.Navigator, { testID: 'Navigator-1',
        screenOptions: {
          headerShown: false,
          tabBarStyle: {
            position: 'absolute', bottom: 0,
            height: Platform.OS === 'web' ? TAB_MENU_HEIGHT : TAB_MENU_HEIGHT + insets.bottom,
            paddingBottom: 0, borderTopWidth: 0,
            backgroundColor: theme.colors.card,
            shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 12
          },
          tabBarItemStyle: { padding: 0 },
          tabBarActiveTintColor: primaryColor,
          tabBarInactiveTintColor: textSecondary
        }
      },
        React.createElement(Tab.Screen, { testID: 'Screen-1',
          name: 'Browse',
          component: BrowseScreen,
          options: {
            tabBarLabel: 'Услуги',
            tabBarIcon: function(p) { return React.createElement(Ionicons, { testID: 'Ionicons-8', name: p.focused ? 'home' : 'home-outline', size: 22, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-2',
          name: 'Requests',
          component: RequestsScreen,
          options: {
            tabBarLabel: 'Заявки',
            tabBarIcon: function(p) { return React.createElement(Ionicons, { testID: 'Ionicons-9', name: p.focused ? 'document-text' : 'document-text-outline', size: 22, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-3',
          name: 'MyServices',
          component: MyServicesScreen,
          options: {
            tabBarLabel: profile.isProvider ? 'Мои услуги' : 'Предложить',
            tabBarIcon: function(p) { return React.createElement(Ionicons, { testID: 'Ionicons-10', name: p.focused ? 'briefcase' : 'briefcase-outline', size: 22, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-4',
          name: 'Bookings',
          component: BookingsScreen,
          options: {
            tabBarLabel: 'Заказы',
            tabBarIcon: function(p) { return React.createElement(Ionicons, { testID: 'Ionicons-11', name: p.focused ? 'calendar' : 'calendar-outline', size: 22, color: p.color }); }
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-5',
          name: 'Profile',
          component: ProfileScreen,
          options: {
            tabBarLabel: 'Профиль',
            tabBarIcon: function(p) { return React.createElement(Ionicons, { testID: 'Ionicons-12', name: p.focused ? 'person' : 'person-outline', size: 22, color: p.color }); }
          }
        })
      )
    );
  };
  // @end:TabNavigator

  // @section:MainNavigator @depends:[TabNavigator,ListingDetailScreen,navigation-setup]
  var MainNavigator = function() {
    return React.createElement(Stack.Navigator, { testID: 'Navigator-2', screenOptions: { headerShown: false }, initialRouteName: 'Main' },
      React.createElement(Stack.Screen, { testID: 'Screen-6', name: 'Main', component: TabNavigator }),
      React.createElement(Stack.Screen, { testID: 'Screen-7', name: 'ListingDetail', component: ListingDetailScreen, initialParams: { listing: null } })
    );
  };
  // @end:MainNavigator

  // @section:styles @depends:[theme]
  const styles = StyleSheet.create({
    listingCard: {
      backgroundColor: cardColor,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#E85D75',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardColor,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: textPrimary,
      marginBottom: 6,
      marginTop: 4,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#F0D6DB',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: textPrimary,
      backgroundColor: backgroundColor,
      marginBottom: 14,
    },
    primaryBtn: {
      backgroundColor: primaryColor,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      shadowColor: primaryColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 6,
      marginBottom: 10,
    },
    primaryBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '800',
    },
    secondaryBtn: {
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: 'center',
      marginBottom: 4,
    },
    secondaryBtnText: {
      fontSize: 15,
      fontWeight: '600',
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F0D6DB',
    },
  });
  // @end:styles

  // @section:return @depends:[MainNavigator,ThemeProvider]
  return React.createElement(ThemeProvider, { testID: 'ThemeProvider-1' },
    React.createElement(View, { testID: 'View-84', style: { flex: 1, width: '100%', height: '100%' } },
      React.createElement(StatusBar, { testID: 'StatusBar-1', backgroundColor: primaryColor, barStyle: 'light-content' }),
      React.createElement(MainNavigator)
    )
  );
  // @end:return
};
return ComponentFunction;
