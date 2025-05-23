import { TempFs } from 'nx/src/internal-testing-utils/temp-fs';
import { findGradlewFile } from './exec-gradle';

describe('exec gradle', () => {
  describe('findGradlewFile', () => {
    let tempFs: TempFs;
    let cwd: string;

    beforeEach(async () => {
      tempFs = new TempFs('test');
      cwd = process.cwd();
      process.chdir(tempFs.tempDir);
    });

    afterEach(() => {
      jest.resetModules();
      process.chdir(cwd);
    });

    it('should find gradlew with one gradlew file at root', async () => {
      await tempFs.createFiles({
        'proj/build.gradle': ``,
        gradlew: '',
        'nested/nested/proj/build.gradle': ``,
        'nested/nested/proj/settings.gradle': ``,
        'nested/nested/proj/src/test/java/test/rootTest.java': ``,
        'nested/nested/proj/src/test/java/test/aTest.java': ``,
        'nested/nested/proj/src/test/java/test/bTest.java': ``,
      });
      let gradlewFile = findGradlewFile('proj/build.gradle', tempFs.tempDir);
      expect(gradlewFile).toEqual('gradlew');
      gradlewFile = findGradlewFile(
        'nested/nested/proj/build.gradle',
        tempFs.tempDir
      );
      expect(gradlewFile).toEqual('gradlew');
      gradlewFile = findGradlewFile(
        'nested/nested/proj/settings.gradle',
        tempFs.tempDir
      );
      expect(gradlewFile).toEqual('gradlew');
    });

    it('should find gradlew with multiple gradlew files with nested project structure', async () => {
      await tempFs.createFiles({
        'proj/build.gradle': ``,
        'proj/gradlew': '',
        'proj/settings.gradle': ``,
        'nested/nested/proj/gradlew': '',
        'nested/nested/proj/build.gradle': ``,
        'nested/nested/proj/settings.gradle': ``,
        'nested/nested/proj/src/test/java/test/rootTest.java': ``,
        'nested/nested/proj/src/test/java/test/aTest.java': ``,
        'nested/nested/proj/src/test/java/test/bTest.java': ``,
      });

      let gradlewFile = findGradlewFile('proj/build.gradle', tempFs.tempDir);
      expect(gradlewFile).toEqual('proj/gradlew');
      gradlewFile = findGradlewFile('proj/settings.gradle', tempFs.tempDir);
      expect(gradlewFile).toEqual('proj/gradlew');
      gradlewFile = findGradlewFile(
        'nested/nested/proj/build.gradle',
        tempFs.tempDir
      );
      expect(gradlewFile).toEqual('nested/nested/proj/gradlew');
      gradlewFile = findGradlewFile(
        'nested/nested/proj/settings.gradle',
        tempFs.tempDir
      );
      expect(gradlewFile).toEqual('nested/nested/proj/gradlew');
    });

    it('should throw an error if no gradlw in workspace', async () => {
      await tempFs.createFiles({
        'proj/build.gradle': ``,
        'nested/nested/proj/build.gradle': ``,
        'nested/nested/proj/settings.gradle': ``,
        'nested/nested/proj/src/test/java/test/rootTest.java': ``,
        'nested/nested/proj/src/test/java/test/aTest.java': ``,
        'nested/nested/proj/src/test/java/test/bTest.java': ``,
      });
      expect(() =>
        findGradlewFile('proj/build.gradle', tempFs.tempDir)
      ).toThrow();
    });
  });
});
