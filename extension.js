const vscode = require(`vscode`);
const fs = require(`fs`);
const path = require(`path`);




/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    `getx-helper.init-app`,
    function () {
      
      const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

      upgradeMinSdk(folderPath);
      vscode.window.showInputBox({ placeHolder: `App name `,value:vscode.workspace.name }).then((text) => {
        var _text = text.trim();
        if (_text.length > 0) {
          var _path = folderPath + `${path.sep}lib${path.sep}app${path.sep}`;

          createFolders(_path);
          setTimeout(() => createFirstFiles(folderPath, _text.trim()), 1000);
          
          var term1 = vscode.window.createTerminal('flutter');
          term1.show();
          term1.sendText('flutter pub get ');
          term1.sendText(` dart pub upgrade --null-safety `);
          term1.sendText(` dart pub global activate flutterfire_cli`);
          term1.sendText(`exit `);
          term1.dispose();


          var term = vscode.window.createTerminal(`firebase`);
          term.show();
          term.sendText(`firebase init`);
          term.sendText( `flutterfire configure`);
          term.sendText( `exit`);
          term.show();

          vscode.window.showInformationMessage(`Done!`);
        }
      });
    }
  );

  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand(
    `getx-helper.new-page`,
    function () {
      const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      var _path = folderPath + `${path.sep}lib${path.sep}app${path.sep}`;

      vscode.window.showInputBox({ placeHolder: `Page name` }).then((text) => {
        var _text = text.trim();
        if (_text.length > 0) {
          var _frendlyText = frendlyText(_text);
          createBinding(_path, _frendlyText);
          createController(_path, _frendlyText);
          createPage(_path, _frendlyText, true);
          vscode.window.showInformationMessage(_text + ` created!`);
        }
      });
    }
  );

  context.subscriptions.push(disposable2);

  let disposable3 = vscode.commands.registerCommand(
    `getx-helper.new-model`,
    function () {
      const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      var _path = folderPath + `${path.sep}lib${path.sep}app${path.sep}`;

      vscode.window.showInputBox({ placeHolder: `Model name` }).then((text) => {
        var _text = text.trim();
        if (_text.length > 0) {
          var _frendlyText = frendlyText(_text);
          createModel(_path, _frendlyText);
          terminalFreezedCommand();
          vscode.window.showInformationMessage(_text + ` created!`);
        }
      });
    }
  );

  context.subscriptions.push(disposable3);

  let disposable4 = vscode.commands.registerCommand(
    `getx-helper.new-failure`,
    function () {
      const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      var _path = folderPath + `${path.sep}lib${path.sep}app${path.sep}`;

      vscode.window
        .showInputBox({ placeHolder: `Failure name` })
        .then((text) => {
          var _text = text.trim();
          if (_text.length > 0) {
            var _frendlyText = frendlyText(_text);
            createFailure(_path, _frendlyText);
            terminalFreezedCommand();
            vscode.window.showInformationMessage(_text + ` created!`);
          }
        });
    }
  );

  context.subscriptions.push(disposable4);
  let disposable5 = vscode.commands.registerCommand(
    `getx-helper.new-repository`,
    function () {
      const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      var _path = folderPath + `${path.sep}lib${path.sep}app${path.sep}`;

      vscode.window
        .showInputBox({ placeHolder: `Repository name` })
        .then((text) => {
          var _text = text.trim();
          if (_text.length > 0) {
            var _frendlyText = frendlyText(_text);
            createRepository(_path, _frendlyText);
            vscode.window.showInformationMessage(_text + ` created!`);
          }
        });
    }
  );

  context.subscriptions.push(disposable5);
  let disposable6 = vscode.commands.registerCommand(
    `getx-helper.freezed-command`,
    function () {
      terminalFreezedCommand();
    }
  );

  context.subscriptions.push(disposable6);
}



function upgradeMinSdk(myPath) {
  fs.readFile(myPath + `${path.sep}android${path.sep}app${path.sep}build.gradle`, `utf8`, function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(`flutter.minSdkVersion`, `21`);

    fs.writeFile(
      myPath + `${path.sep}android${path.sep}app${path.sep}build.gradle`,
      result,
      `utf8`,
      function (err) {
        if (err) return console.log(err);
      }
    );
  });
}



function createAssets(myPath) {
  fs.mkdir(myPath + `${path.sep}assets`, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(myPath + `${path.sep}assets${path.sep}icons`, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(myPath + `${path.sep}assets${path.sep}animation`, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(myPath + `${path.sep}assets${path.sep}image`, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

/**
 * @param {string} pagePath
 */

function createFolders(pagePath) {
  createAssets(vscode.workspace.workspaceFolders[0].uri.fsPath);
  var folders = [
    `bindings`,
    `config`,
    `controllers`,
    `routes`,
    `translation`,
    `data`,
    `data${path.sep}helpers`,
    `data${path.sep}models`,
    `data${path.sep}failures`,
    `data${path.sep}provider`,
    `data${path.sep}provider${path.sep}local`,
    `data${path.sep}provider${path.sep}repositories`,
    `data${path.sep}services`,
    `ui`,
    `ui${path.sep}global_widgets`,
    `ui${path.sep}layouts`,
    `ui${path.sep}layouts${path.sep}main`,
    `ui${path.sep}layouts${path.sep}main${path.sep}widgets`,
    `ui${path.sep}pages`,
    `ui${path.sep}theme`,
    `ui${path.sep}utils`,
  ];

  for (let index = 0; index < folders.length; index++) {
    const element = folders[index];
    fs.mkdir(pagePath + element, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }
}
function createAppPages(pagePath) {
  var newPath = pagePath + `routes${path.sep}`;

  const content = `
import 'package:get/get.dart';


import '../bindings/home_binding.dart';
import '../ui/pages/home_page/home_page.dart';
import '../ui/pages/unknown_route_page/unknown_route_page.dart';
import 'app_routes.dart';

const _defaultTransition = Transition.native;

class AppPages {
  static final unknownRoutePage = GetPage(
    name: AppRoutes.UNKNOWN,
    page: () => const UnknownRoutePage(),
    transition: _defaultTransition,
  );

  static final List<GetPage> pages = [
    unknownRoutePage,
    GetPage(
      name: AppRoutes.HOME,
      page: () => const HomePage(),
      binding: HomeBinding(),
      transition: _defaultTransition,
    ),
  ];
}
`;

  fs.writeFile(path.join(newPath, `app_pages.dart`), content, (err) =>
    console.log(err)
  );
}
function deactivate() {}

/**
 * @param {string} pagePath
 * @param {string} pageName
 */

function createFirstFiles(pagePath, pageName) {
  var _frendlyText = frendlyText(pageName);
  var _capitalizeText = capitalize(pageName);

  createPubSpect(pagePath, _frendlyText);

  var _path = pagePath + `${path.sep}lib${path.sep}app${path.sep}`;
  createAppRoutes(_path);
  createAppPages(_path);
  createAppInformation(_path, _capitalizeText);
  createMainLayout(_path, _capitalizeText);
  createTraslation(_path, _capitalizeText);
  createMain(pagePath + `${path.sep}lib${path.sep}`, _capitalizeText);
  createController(_path, `main`);
  createController(_path, `navigation`);
  createDependecyInjection(_path);
  createThemes(_path);
  createThemesService(_path);
  createTraslationService(_path);
  createModelHelpers(_path);
  cleanTest(pagePath);

  _frendlyText = `home`;

  createBinding(_path, _frendlyText);
  createController(_path, _frendlyText);
  createPage(_path, _frendlyText, false);

  _frendlyText = `unknown_route`;
  createBinding(_path, _frendlyText);
  createController(_path, _frendlyText);
  createPage(_path, _frendlyText, false);
}

function createAppRoutes(pagePath) {
  var newPath = pagePath + `routes${path.sep}`;

  const content = `
 // ignore_for_file: constant_identifier_names
  class AppRoutes {
  static const HOME = '/';
  static const UNKNOWN = '/404';
}`;

  fs.writeFile(path.join(newPath, `app_routes.dart`), content, (err) =>
    console.log(err)
  );
}
function createAppInformation(pagePath, pageName) {
  var _frendlyText = frendlyText(pageName);

  var newPath = pagePath + `config${path.sep}`;

  const content =
    `class AppInformation {
  static const name = '` +
    _frendlyText +
    `';
  static const title = '` +
    pageName +
    `';
  static const appIdAndroid = "";
  static const appIdIos = "";
  static const masterAdminEmail = "";
  static const googleMapsKey = '';
  static const googleMapsKeyURL = '';
}
`;
  fs.writeFile(path.join(newPath, `app_information.dart`), content, (err) =>
    console.log(err)
  );
}

function createMainLayout(pagePath, pageName) {
  var newPath = pagePath + `ui${path.sep}layouts${path.sep}main${path.sep}`;

  const content = `import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../controllers/main_controller.dart';
export 'package:flutter_screenutil/flutter_screenutil.dart';

class MainLayout extends GetView<MainController> {
  final Widget child;
  const MainLayout({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center (child:child);
  }
}
`;
  fs.writeFile(path.join(newPath, `main_layout.dart`), content, (err) =>
    console.log(err)
  );
}

function createDependecyInjection(pagePath) {
  var newPath = pagePath + `data${path.sep}services`;

  const content = `import '../../controllers/navigation_controller.dart';
  import '../../controllers/main_controller.dart';
  import '../../../firebase_options.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class DependecyInjection {
static Future<void> init() async {
  // firebase init
  await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    await GetStorage.init();

    Get.put<NavigationController>(NavigationController());
    Get.put<MainController>(MainController());
  }
}`;
  fs.writeFile(
    path.join(newPath, `dependency_injection.dart`),
    content,
    (err) => console.log(err)
  );
}
function createThemes(pagePath) {
  var newPath = pagePath + `ui${path.sep}theme`;

  const content = `
import 'package:flutter/material.dart';

class Themes {
  final lightTheme = ThemeData.light().copyWith(
    primaryColor: Colors.red,
    cardColor: Colors.white,
    scaffoldBackgroundColor: Colors.grey[200],
    shadowColor: Colors.grey,
  );
  final darkTheme = ThemeData.dark().copyWith(
    primaryColor: Colors.grey[900],
    cardColor: Colors.grey[900],
    scaffoldBackgroundColor: Colors.grey[800],
    shadowColor: Colors.grey,
  );
}
`;
  fs.writeFile(path.join(newPath, `themes.dart`), content, (err) =>
    console.log(err)
  );
}
function createThemesService(pagePath) {
  var newPath = pagePath + `data${path.sep}services${path.sep}`;

  const content = `
import 'package:get_storage/get_storage.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ThemeService {
  final _getStorage = GetStorage();
  final _storageKey = 'ThemeMode';
  static ThemeService instance = ThemeService._();
  // ignore: empty_constructor_bodies
  ThemeService._() {}
  set themeMode(ThemeMode themeMode) {
    if (themeMode == ThemeMode.system) {
      _getStorage.remove(_storageKey);
    } else {
      _getStorage.write(_storageKey, themeMode == ThemeMode.dark);
    }
    Get.changeThemeMode(themeMode);
  }

  ThemeMode get themeMode {
    switch (_getStorage.read(_storageKey)) {
      case true:
        return ThemeMode.dark;
      case false:
        return ThemeMode.light;
      default:
        return ThemeMode.system;
    }
  }
}

`;
  fs.writeFile(path.join(newPath, `theme_service.dart`), content, (err) =>
    console.log(err)
  );
}
function createTraslationService(pagePath) {
  var newPath = pagePath + `data${path.sep}services${path.sep}`;

  const content = `
import 'package:get/get.dart';

import '../../translation/en.dart';
import '../../translation/ar.dart';

class Translation extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {'en': en,'ar': ar};
}

`;
  fs.writeFile(
    path.join(newPath, `translations_service.dart`),
    content,
    (err) => console.log(err)
  );
}
function createModelHelpers(pagePath) {
  var newPath = pagePath + `data${path.sep}helpers${path.sep}`;

  const content = `
class ModelHelpers {
  Map<String, dynamic> fromDocument(dynamic data) {
    data['createdAt'] = dateFromDocument(data['createdAt']);

    if (data['updatedAt'] != null) {
      data['updatedAt'] = dateFromDocument(data['updatedAt']);
    } else {
      data['updatedAt'] = data['createdAt'];
    }
    return data;
  }

  Map<String, dynamic> toDocument(Map<String, dynamic> json) {
    json = json..remove('id');
    json['createdAt'] = dateToDocument(json['createdAt']);
    json['updatedAt'] = dateToDocument(json['updatedAt']);
    return json;
  }

  String dateFromDocument(date) {
    if (date != null) {
      return date.toDate().toString();
    }
    return DateTime.now().toString();
  }

  DateTime dateToDocument(String? date) {
    if (date != null) {
      return DateTime.parse(date);
    }
    return DateTime.now();
  }
}
`;
  fs.writeFile(path.join(newPath, `model_helpers.dart`), content, (err) =>
    console.log(err)
  );
}
function cleanTest(pagePath) {
  var newPath = pagePath + `${path.sep}test${path.sep}`;

  fs.writeFile(path.join(newPath, `widget_test.dart`), ``, (err) =>
    console.log(err)
  );
}

function createMain(pagePath, pageName) {
  var newPath = pagePath;

  const content = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'app/data/services/dependency_injection.dart';
import 'app/data/services/theme_service.dart';
import 'app/data/services/translations_service.dart';
import 'app/routes/app_pages.dart';
import 'app/routes/app_routes.dart';
import 'app/ui/layouts/main/main_layout.dart';
import 'app/ui/theme/themes.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  DependecyInjection.init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

   return ScreenUtilInit(
      builder: (_,__) {
        return GetMaterialApp(
          title: '${pageName}',
          debugShowCheckedModeBanner: false,
          theme: Themes().lightTheme,
          darkTheme: Themes().darkTheme,
          themeMode: ThemeService.instance.themeMode,
          translations: Translation(),
          locale: const Locale('en'),
          fallbackLocale: const Locale('en'),
          initialRoute: AppRoutes.HOME,
          unknownRoute: AppPages.unknownRoutePage,
          getPages: AppPages.pages,
          builder: (_, child) {
            return MainLayout(child: child!);
          },
        );
      },
     //! Must change it to true if you want to use the ScreenUtil
      designSize: const Size(411, 823),
    );
  }
}
`;
  fs.writeFile(path.join(newPath, `main.dart`), content, (err) =>
    console.log(err)
  );
}
function createTraslation(pagePath, pageName) {
  var newPath = pagePath + `translation`;

  const en =
    `const Map<String, String> en = {
  'homeTitle': '` +
    pageName +
    `',
};
`;
  const ar =
    `const Map<String, String> ar = {
  'homeTitle': '` +
    pageName +
    `',
};
`;

  fs.writeFile(path.join(newPath, `en.dart`), en, (err) => console.log(err));
  fs.writeFile(path.join(newPath, `ar.dart`), ar, (err) => console.log(err));
}

function createPubSpect(pagePath, pageName) {
  const content =
    `name: ` +
    pageName +
    `
description: A new Flutter project.

version: 1.0.0+1

environment:
  sdk: ">=2.12.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

  cupertino_icons:
  get:
  get_storage:
  flutter_lints:
  freezed_annotation:
  dartz:
  json_serializable:
  rxdart:
  firebase_auth:
  firebase_messaging:
  firebase_core:
  cloud_firestore:
  flutter_screenutil:

dev_dependencies:
  build_runner: 
  freezed: 
  
# #to make native splash screen
# # 1) change path image_path
# # 2) run commened -> flutter pub run flutter_native_splash:create
#   flutter_native_splash: ^2.1.1
# flutter_native_splash:
#   background_image: assets/image/splash_background.png # choose one color or background
#   color: "#ffffff"
#   image: assets/icons/icon.png

# # to change icon 
# # 1) change path image_path
# # 2) run commened -> flutter pub run flutter_launcher_icons:main
#   flutter_launcher_icons: ^0.9.2
# flutter_icons:
#   android: true
#   ios: true
#   remove_alpha_ios: true
#   image_path: "assets/icons/icon.png" 


  flutter_test:
    sdk: flutter

flutter:
  assets:
    - assets/icons/
    - assets/image/
    - assets/animation/
  uses-material-design: true
`;

  fs.writeFile(path.join(pagePath, "pubspec.yaml"), content, (err) =>
    console.log(err)
  );
}

function createBinding(pagePath, pageName) {
  var className = capitalizeName(pageName);
  const content =
    `
import 'package:get/get.dart';
import '../controllers/` +
    pageName +
    `_controller.dart';


class ` +
    className +
    `Binding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<` +
    className +
    `Controller>(() => ` +
    className +
    `Controller());
        // Get.put<` +
    className +
    `Controller>(` +
    className +
    `Controller());
  }
}`;

  var newPath = pagePath + `bindings${path.sep}`;
  fs.writeFile(path.join(newPath, pageName + `_binding.dart`), content, (err) =>
    console.log(err)
  );
}

function createModel(pagePath, pageName) {
  var className = capitalizeName(pageName);
  const content =
    `
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../helpers/model_helpers.dart';

part '` +
    pageName +
    `.freezed.dart';
part '` +
    pageName +
    `.g.dart';

@freezed
abstract class ` +
    className +
    ` implements _$` +
    className +
    ` {
  const ` +
    className +
    `._();

  const factory ` +
    className +
    `({
    required String id,
    String? name,
    @Default(false) bool active,
    String? createdAt,
    String? updatedAt,
  }) = _` +
    className +
    `;

  factory ` +
    className +
    `.fromJson(Map<String, dynamic> json) =>
      _$` +
    className +
    `FromJson(json);

  factory ` +
    className +
    `.empty() => ` +
    className +
    `(id: '');

  factory ` +
    className +
    `.fromDocument(DocumentSnapshot doc) =>
      ` +
    className +
    `.fromJson(ModelHelpers().fromDocument(doc.data()!))
          .copyWith(id: doc.id);

  Map<String, dynamic> toDocument() => ModelHelpers().toDocument(toJson());
}
    `;

  var newPath = pagePath + `data${path.sep}models${path.sep}` + pageName + `${path.sep}`;

  fs.mkdir(newPath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(path.join(newPath, pageName + `.dart`), content, (err) =>
      console.log(err)
    );
  });
}

function createFailure(pagePath, pageName) {
  var className = capitalizeName(pageName);
  const content =
    `
import 'package:freezed_annotation/freezed_annotation.dart';
part '` +
    pageName +
    `_failure.freezed.dart';

@freezed
abstract class ` +
    className +
    `Failure with _$` +
    className +
    `Failure {
const factory ` +
    className +
    `Failure.unexpected() = _Unexpected;
const factory ` +
    className +
    `Failure.insufficientPermission() = _InsufficientPermission;
const factory ` +
    className +
    `Failure.permissionDenied() = _PermissionDenied;
const factory ` +
    className +
    `Failure.tooManyRequests() = _TooManyRequests;
const factory ` +
    className +
    `Failure.serverError() = _ServerError;
}
    `;

  var newPath = pagePath + `data${path.sep}failures${path.sep}` + pageName + `${path.sep}`;

  fs.mkdir(newPath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(
      path.join(newPath, pageName + `_failure.dart`),
      content,
      (err) => console.log(err)
    );
  });
}

function createRepository(pagePath, pageName) {
  var className = capitalizeName(pageName);
  const content =
    `
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dartz/dartz.dart';
import 'package:get/get.dart';
import 'package:rxdart/rxdart.dart';

import '../../failures/firestore/firestore_failure.dart';

class ` +
    className +
    `Repository {
  final FirebaseAuth _firebaseAuth = Get.find<FirebaseAuth>();
  final FirebaseFirestore _firebaseFirestore = Get.find<FirebaseFirestore>();

  Stream<Either<FirestoreFailure, List<DocumentSnapshot>>>
      getElements() async* {
    try {
      print('do somenthing');
    } catch (e) {
      yield left(const FirestoreFailure.unexpected());
    }
  }
}
    `;

  var newPath = pagePath + `data${path.sep}provider${path.sep}repositories`;

  fs.writeFile(
    path.join(newPath, pageName + `_repository.dart`),
    content,
    (err) => console.log(err)
  );
}
function createController(pagePath, pageName) {
  var className = capitalizeName(pageName);
  const content =
    `
import 'package:get/get.dart';
class ` +
    className +
    `Controller extends GetxController {}`;

  var newPath = pagePath + `controllers${path.sep}`;
  fs.writeFile(
    path.join(newPath, pageName + `_controller.dart`),
    content,
    (err) => console.log(err)
  );
}

function createPage(pagePath, pageName, updateFiles) {
  var className = capitalizeName(pageName);

  const content =
    `import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../layouts/main/main_layout.dart';

import '../../../controllers/` +
    pageName +
    `_controller.dart';

class ` +
    className +
    `Page extends GetView<` +
    className +
    `Controller> {
      const ` +
    className +
    `Page ({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return const MainLayout(
        child: Text('` +
    className +
    `'),
      );
  }
}
`;

  var newPath = pagePath + `ui${path.sep}pages${path.sep}` + pageName + `_page`;
  fs.mkdir(newPath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(path.join(newPath, pageName + `_page.dart`), content, (err) =>
      console.log(err)
    );
    if (updateFiles) {
      updateRoute(pagePath, pageName);
      updatePages(pagePath, pageName);
    }
  });
}

function updateRoute(pagePath, pageName) {
  var newPath = pagePath + `routes${path.sep}`;
  var file = `app_routes.dart`;

  fs.readFile(newPath + file, `utf8`, function (err, data) {
    var _d = data.trim();
    var newData = _d.substring(0, _d.length - 1);
    var newName = pageName.toUpperCase();
    var urlName = transformUrlName(pageName);
    const content =
      newData +
      `  static const ` +
      newName +
      ` = /` +
      urlName +
      `';
}`;
    fs.writeFile(path.join(newPath, file), content, (err) => console.log(err));
    console.log(data);
  });
}

function updatePages(pagePath, pageName) {
  var newPath = pagePath + `routes${path.sep}`;
  var file = `app_pages.dart`;
  var className = capitalizeName(pageName);

  fs.readFile(newPath + file, `utf8`, function (err, data) {
    var _d = data.trim();
    var _d2 = _d.substring(0, _d.length - 1);
    var _d3 = _d2.trim();
    var _d31 = _d3.substring(0, _d3.length - 1);
    var _d4 = _d31.trim();
    var _d41 = _d4.substring(0, _d4.length - 1);
    var newData = _d41.trim();

    var newName = pageName.toUpperCase();

    var topContent =
      `import '../bindings/` +
      pageName +
      `_binding.dart';
import '../ui/pages/` +
      pageName +
      `_page/` +
      pageName +
      `_page.dart';
      `;

    const content =
      topContent +
      newData +
      `
    GetPage(
      name: AppRoutes.` +
      newName +
      `,
      page: () => const ` +
      className +
      `Page(),
      binding: ` +
      className +
      `Binding(),
      transition: _defaultTransition,
    ), 
];
}`;
    fs.writeFile(path.join(newPath, file), content, (err) => console.log(err));
    console.log(data);
  });
}
function frendlyText(text) {
  var _newText = text.toLowerCase();
  _newText = removeSpecialCharacters(_newText);
  _newText = removeAccents(_newText);
  _newText = _newText.replace(/\s/g, "_");

  return _newText.trim();
}

function capitalizeName(text) {
  var _newText = text.replaceAll("_", " ");
  var pepe2 = _newText.replace(/\b[a-z]/g, (match) => match.toUpperCase());
  var _newText2 = pepe2.replaceAll(" ", "");
  return _newText2.trim();
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const removeSpecialCharacters = (str) => {
  return str.replace(/[^\w\s]/gi, "");
};

const transformUrlName = (str) => {
  return str.replaceAll("_", "-");
};

const capitalize = (s) => {
  return s[0].toUpperCase() + s.substring(1);
};

function terminalFreezedCommand() {
  var command =
    `flutter pub run build_runner watch --delete-conflicting-outputs`;
  var term = vscode.window.createTerminal(`Dawn`);
  term.show();
  term.sendText(`${command}`);
}
function terminalCommand(command) {
  var term = vscode.window.createTerminal(`Dawn`);
  term.show();
  term.sendText(`${command}`);
}
module.exports = {
  activate,
  deactivate,
};
