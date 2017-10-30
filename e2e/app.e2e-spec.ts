import { MiProyectoAngularPage } from './app.po';

describe('mi-proyecto-angular App', () => {
  let page: MiProyectoAngularPage;

  beforeEach(() => {
    page = new MiProyectoAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
