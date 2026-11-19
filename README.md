# ONEFLOW
**One order. One production plan. One delivery promise.**

Team Masterminds’ interactive Coil-to-Cash manufacturing control tower for Rupsha Cables Ltd. The eight workspaces share a simulated order book. Case baselines and management targets retain their original meaning throughout the demo.

## Open it immediately
Extract the ZIP first. Open **offline/ONEFLOW.html** in Chrome or Edge and choose **Enter demo workspace**. Fonts, cable artwork and application code are embedded. Keep this file on your presentation laptop for offline rehearsal.

## Run the Next.js app in VS Code
1. Install Node.js 22.13 or newer (Node 22 LTS recommended).
2. Open the folder containing **package.json** in VS Code. Open its integrated terminal.
3. Run the commands below. Visit the local address printed in your terminal, normally http://localhost:3000.

```sh
npm install
npm test
npm run dev
```

For the local production check, stop the development server with Ctrl+C.

```sh
npm run build
npm run start
```

## GitHub and Vercel
The release ZIP contains the source, tests, and a tagged Git bundle. To keep the supplied commit and release tag, run the following from the extracted folder containing **ONEFLOW-v1.1.0.bundle**. Open the newly cloned folder in VS Code.

```sh
git clone ONEFLOW-v1.1.0.bundle oneflow-repository
cd oneflow-repository
git remote remove origin
git tag
```

Use VS Code Source Control → Publish to GitHub and choose your account and repository visibility. After the initial npm install, commit the generated package-lock.json so subsequent builds can reproduce the versions installed on your machine.

In Vercel, create a new project, import your GitHub repository, and select the **Next.js** preset. Set the root directory to the folder containing package.json (the cloned repository root). Use the standard Next.js build settings. This demo needs no environment variables or database. Deploy, open the resulting project URL and rehearse once on the presentation laptop.

## Competition walkthrough
Choose **Guided walkthrough** on the entry screen or in the Executive Control Tower. A presenter can advance six decisions with one button per step. The same order balance follows sales confirmation, stock reservation, production and delivery. Replay starts a fresh scenario. Exit returns to the workspace. Rehearsals use their own order book.

On phones, open the menu in the top bar. Below 621 px, table rows become labelled records. Charts include a **View chart values** disclosure for reading exact numbers. On laptops, the dashboard uses multiple columns and a persistent sidebar. Rotating or resizing the browser applies the layout automatically.

## A three-minute pitch

| Time | Screen and action | What to say |
|---|---|---|
| 0:00 | Enter the workspace. Point to OTIF and capital utilisation. | “RCL delivers 76% of orders on time and in full while drawing BDT 79 crore against an 85 crore limit.” |
| 0:25 | Dealer Portal → P1 Solid Core Wire → Place order → Submit order. Note the order ID. | “Delta Electricals asks for 100 coils. Sales and planning now see the same request.” |
| 0:50 | Sales Management → Review → Confirm on the new order. | “The request becomes a confirmed production commitment.” |
| 1:10 | Production Planning → select the new order → Allocate 60 coils → Generate work order for 40. | “We reserve the stock we already have. Only the shortfall enters production.” |
| 1:40 | Open factory floor. Select the matching work order, enter 40 good coils, and submit. | “The order is now ready for dispatch. Operator output updates the same order the dealer tracks.” |
| 2:05 | Sales Management → Mark delivered. Return to Dealer Portal and show all six tracking stages. | “The dealer sees the delivery outcome against the original request.” |
| 2:25 | Finance & Inventory → compare P1’s 5 days of cover with P4’s 52. End on the control tower’s Coil-to-Cash panel. | “Pull demand, protect capacity, prepare copper supply, and release working capital. At least 92% OTIF is our proposed target.” |

**Short route:** Planning opens with sample order OF-1042 already confirmed. Start there to show the 60/40 decision in under a minute. Choose either the sample route or the new-order route per rehearsal because both draw from the same 60 coils. **Reset demo** restores the opening data and entry screen.

## Test suite
- **npm test** runs model, screen-rendering, standalone-file and mounted interaction tests using Node.
- **npm run build**, **npx playwright install chromium**, then **npm run test:e2e** run the real-browser scenarios against the production Next.js server. Stop any other process using port 3000 first.
- GitHub Actions runs the model/UI checks, Next.js build and Playwright tests on pushes and pull requests.
- **npm run offline** regenerates the standalone presentation copy after UI changes.

## Data and implementation
- **RCL Case Baseline** covers the six executive KPIs, inventory values and policy context. Trends, dealers, orders and machine statuses use **Illustrative Prototype Data**. Supplier shares and OTIF ambition are **Proposed Targets**.
- A simulated receipt increases the procurement workspace’s current copper balance. The executive case opening balance remains 205 t. Report date filters change the trend series and CSV rows. Snapshot cards use their labelled time basis.
- Role switching changes the working view. This is a presentation feature. Each browser keeps its own simulated activity in local storage. Use one browser and tab for a continuous rehearsal.
- Next.js App Router and React host a shared JavaScript interface, with local CSS, Lucide icons, accessible chart descriptions, locally bundled Inter and custom cable illustrations. The offline file reuses the same rendering and workflow modules.
- **app/** contains the Next.js entry and styling. **src/model.mjs** holds the state transitions. **src/views.mjs** provides the eight workspace views and charts. **src/interface.mjs** connects forms, navigation, notifications, export, persistence and reset.

## Release verification
32 automated Node tests passed during packaging. They cover the dealer-to-delivery event sequence, insufficient and sufficient stock, duplicate actions, invalid quantities, reports, asset references, UI rendering and standalone script syntax. The Next.js production build could not be executed in the packaging environment because the npm registry was inaccessible. The preview environment blocked opening the local application for visual inspection. The browser suite includes ten viewport widths from 320 to 1440 px and covers all eight screens, the presenter journey, and mobile navigation. These layout checks and the production build remain pending execution on GitHub Actions or a local development machine.
