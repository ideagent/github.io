/**
 * IDEAgent Documentation - Navigation & Interactivity
 */
(function () {
  'use strict';

  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    var setMenuState = function (isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    };

    toggle.addEventListener('click', function () {
      var isCurrentlyOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isCurrentlyOpen);
    });

    // Close when clicking any nav link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenuState(false);
        toggle.focus();
      }
    });
  }

  // WebMCP Integration (Lighthouse Agentic Browsing & Chrome Model Context API)
  var registerWebMCPTools = function () {
    var mc = (typeof document !== 'undefined' && document.modelContext) ||
             (typeof navigator !== 'undefined' && navigator.modelContext);

    if (!mc || typeof mc.registerTool !== 'function') {
      return;
    }

    // Tool 1: switch_showcase_tab (if showcase is present on the page)
    var showcaseDots = document.querySelectorAll('.showcase-dot');
    if (showcaseDots.length > 0) {
      try {
        mc.registerTool({
          name: 'switch_showcase_tab',
          description: 'Switch the active product screenshot showcase tab in the hero section to chat, threads, tasks, or edits view.',
          inputSchema: {
            type: 'object',
            properties: {
              tab: {
                type: 'string',
                enum: ['chat', 'threads', 'tasks', 'edits'],
                description: 'The target screenshot tab to activate.'
              }
            },
            required: ['tab']
          },
          execute: function (params) {
            var target = params && params.tab;
            var targetDot = document.querySelector('.showcase-dot[data-target="' + target + '"]');
            if (targetDot) {
              targetDot.click();
              return 'Activated showcase tab: ' + target;
            }
            return 'Tab not found: ' + target;
          }
        });
      } catch (err) {
        console.warn('WebMCP switch_showcase_tab registration error:', err);
      }
    }

    // Tool 2: get_documentation_directory
    try {
      mc.registerTool({
        name: 'get_documentation_directory',
        description: 'Returns the index of IDEAgent documentation pages, guides, and tool specifications.',
        inputSchema: {
          type: 'object',
          properties: {}
        },
        execute: function () {
          return JSON.stringify([
            { title: 'IDEAgent Home', url: 'https://ideagent.github.io/', description: 'Product overview, privacy features, and download' },
            { title: 'Architecture', url: 'https://ideagent.github.io/architecture.html', description: 'System design, plugin-gateway architecture, and security layers' },
            { title: 'Gateway', url: 'https://ideagent.github.io/gateway.html', description: 'Multi-agent gateway setup, remote hosts, and ACP daemon' },
            { title: 'Gateway Plugin Setup', url: 'https://ideagent.github.io/gateway_plugin_setup.html', description: 'Step-by-step IDE pairing and token authentication' },
            { title: 'MCP Tools Reference', url: 'https://ideagent.github.io/mcp.html', description: 'Catalog of built-in Model Context Protocol tools' },
            { title: 'JetBrains Plugin Settings', url: 'https://ideagent.github.io/plugin.html', description: 'API keys, models, RAG watcher, and speech tools' },
            { title: 'Server Configuration', url: 'https://ideagent.github.io/server_config.html', description: 'Gateway config files, environment variables, and sandbox limits' },
            { title: 'LLM Specification', url: 'https://ideagent.github.io/llms.txt', description: 'Structured machine-readable site overview' }
          ], null, 2);
        }
      });
    } catch (err) {
      console.warn('WebMCP get_documentation_directory registration error:', err);
    }

    // Tool 3: get_page_toc
    try {
      mc.registerTool({
        name: 'get_page_toc',
        description: 'Extracts headings and major sections from the current document to provide a structured table of contents.',
        inputSchema: {
          type: 'object',
          properties: {}
        },
        execute: function () {
          var headings = Array.prototype.slice.call(document.querySelectorAll('h1, h2, h3'));
          var toc = headings.map(function (h) {
            return {
              level: h.tagName.toLowerCase(),
              title: h.textContent.trim(),
              id: h.id || null
            };
          });
          return JSON.stringify(toc, null, 2);
        }
      });
    } catch (err) {
      console.warn('WebMCP get_page_toc registration error:', err);
    }
  };

  // Run WebMCP registration after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerWebMCPTools);
  } else {
    registerWebMCPTools();
  }
})();
