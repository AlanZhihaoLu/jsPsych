Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/
    /* Change 2: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();
    /* Change 3: Defining and load required resources */
    var jslib_url = "https://alanzhihaolu.github.io/jsPsych/";

    // the below urls must be accessible with your browser
    // for example, https://kywch.github.io/jsPsych/jspsych.js
    var requiredResources = [
        jslib_url + "jspsych.js",
        jslib_url + "plugins/jspsych-html-keyboard-response.js",
        jslib_url + "list_copy.js"
    ];
    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }
    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }
    /* Change 4: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');
    function initExp() {
        var timeline = [];

        var welcome = {
          type: "html-keyboard-response",
          stimulus: "<h3>Welcome to the experiment!</h3>"
        };
        timeline.push(welcome);
    
        var introduction = {
            type: "html-keyboard-response",
            stimulus: "<p>In this experiment, you will be answering questions on briefly presented scene images.</p>" +
            "<p>First, let's first run through an example practice trial.</p>" +
            "<p><em>Press any key to continue.</em></p>"
        }
        timeline.push(introduction);
    
        var instr_fixation = {
          type: 'html-keyboard-response',
          stimulus: "<p>(1) First, you will see a fixation cross, which looks like this:</p>" +
          '<div style="font-size:60px;">+</div>' + 
          "<p>Please keep your eyes on it while it's there!</p>" +
          '<p><em>Press any key to continue.</em></p>'
        }
        var instr_scene_image = {
          type: "html-keyboard-response",
          stimulus: function(){
            var inverted = (jsPsych.timelineVariable('Inverted', true) === "Yes") ? 'style="transform: scaleY(-1);"' : '';
            var scene_image = jsPsych.timelineVariable('SceneImage', true);
            var html = '<p>(2) Next, a scene image will briefly appear in the center of the screen, like this one.</p>' +
              '<img ' + inverted + ' src="https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/SceneImages/' + 
              scene_image + 
              '" alt="' + 
              scene_image + 
              '" width="500" height=auto>' +
              '<p><em>Press any key to continue.</em></p>'
            return html
          }
        }
        var instr_scene_image_inverted = {
          type: "html-keyboard-response",
          stimulus: function(){
            var scene_image = jsPsych.timelineVariable('SceneImage', true);
            var html = '<p>(2, continued) They will also sometimes appear upside-down, like this:</p>' +
              '<img style="transform: scaleY(-1);" src="https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/SceneImages/' + 
              scene_image + 
              '" alt="' + 
              scene_image + 
              '" width="500" height=auto>' +
              '<p><em>Press any key to continue.</em></p>'
            return html
          }
        }
        var instr_mask = {
            type: "html-keyboard-response",
            stimulus: '<p>(3) After that, you will see a noisy "pattern" flash on the screen, like this:</p>' + 
              `<img src="https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/NoiseMask/NoiseMask.png" alt="Noise Mask" width="500" height=375>` +
              '<p><em>Press any key to continue.</em></p>'
        }
        var instr_question = {
            type: 'html-keyboard-response',
            stimulus: function(){
              var html = "<p>(4) Finally, a word describing an object will appear on the screen. In this case, the word is <b>" + jsPsych.timelineVariable('Object', true) + "</b>.<br>" +
              "Please use your keyboard to answer whether the object was present in the scene image shown in (2).<br>" + 
              'If you think the object was present in the scene image, press "1".<br>' +
              'Otherwise, if you think the object was not present in the scene image, press "2".<br>' +
              "Don't worry if you weren't able to tell for sure! Just make your best guess.</p><br>" +
              '<h1>' + jsPsych.timelineVariable('Object', true) + '</h1><br><br>' +
              '<h3>"yes" or "no"<br>1 &nbsp; &nbsp; or &nbsp; &nbsp;2</h3><br><br>' +
              '<p><em>Press "1" or "2" to continue.</em></p>'
              return html
            },
            choices: ['1', '2'],
        }
        var instr_end = {
          type: "html-keyboard-response",
          stimulus: "<p>Great!</p>" +
          "<p>Now let's see what it looks like all put together!</p>" +
          '<p><em>Press any key to continue.</em></p>'
        };
        var instructions = {
          timeline: [instr_fixation, instr_scene_image, instr_scene_image_inverted, instr_mask, instr_question, instr_end],
          timeline_variables: [{SceneImage: "basketball_net.jpg", Object: "Microwave", Inverted: "No", Consistent: "Yes"}]
        }
        timeline.push(instructions);
    
        var fixation = {
          type: 'html-keyboard-response',
          stimulus: '<div style="font-size:60px;">+</div>',
          choices: jsPsych.NO_KEYS,
          trial_duration: 2000,
          data: {test_part: 'fixation'}
        }
        var scene_image = {
          type: "html-keyboard-response",
          stimulus: function(){
            var inverted = (jsPsych.timelineVariable('Inverted', true) === "Yes") ? 'style="transform: scaleY(-1);"' : '';
            var scene_image = jsPsych.timelineVariable('SceneImage', true)
            var html = '<img ' + inverted + ' src="https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/SceneImages/' + 
              scene_image + 
              '" alt="' + 
              scene_image + 
              '" width="500" height=auto>'
            return html
          },
          choices: jsPsych.NO_KEYS,
          trial_duration: function(){
            return jsPsych.randomization.sampleWithoutReplacement([25, 40, 50, 60, 80, 100, 150], 1)[0];
          },
        }
        var mask = {
            type: "html-keyboard-response",
            stimulus: `<img src="https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/NoiseMask/NoiseMask.png" alt="Noise Mask" width="500" height=375>`,
            choices: jsPsych.NO_KEYS,
            trial_duration: 50
        }
        var question = {
            type: 'html-keyboard-response',
            stimulus: function(){
              var html = '<br><br><h1>' + jsPsych.timelineVariable('Object', true) + '</h1><br><br>' +
              '<h3>"yes" or "no"<br>1 &nbsp; &nbsp; or &nbsp; &nbsp;2</h3><br><br>'
              return html
            },
            choices: ['1', '2'],
        }
        var example_trial = {
            timeline: [fixation, scene_image, mask, question],
            timeline_variables: [{SceneImage: "basketball_net.jpg", Object: "Microwave", Inverted: "No", Consistent: "Yes"}]
        }
        timeline.push(example_trial);
    
        var practice_end = {
          type: "html-keyboard-response",
          stimulus: "<p>How was that?</p>" +
          "<p>As you can see, each trial is pretty short.</p>" +
          "<p>Try not to lose focus, and answer as best as you can throughout the experiment.</p>" +
          '<p><em>Press any key to continue.</em></p>'
        }
        timeline.push(practice_end);
    
        var start_note = {
          type: "html-keyboard-response",
          stimulus: "<p>We will now begin the experiment.</p>" + "<p><em>Press any key to start.</em></p>"
        }
        timeline.push(start_note);
    
        var procedure = {
          timeline: [fixation, scene_image, mask, question],
          timeline_variables: test_stimuli
        }
        timeline.push(procedure);
    
        var end_note = {
          type: "html-keyboard-response",
          stimulus: "<p>You have completed the experiment. Thank you!</p>"
        }
        timeline.push(end_note);
    
        var images = ['https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/NoiseMask/NoiseMask.png', 
        "https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/SceneImages/basketball_net.jpg",
        test_stimuli.map(a => `https://raw.githubusercontent.com/AlanZhihaoLu/inverted-scenes/master/Images/SceneImages/${a.SceneImage}`)]
    

        jsPsych.init({
            timeline: timeline,
            preload_images: images,
            display_element: 'display_stage',

            /* Change 6: Adding the clean up and continue functions.*/
            on_finish: function (data) {
                // clear the stage
                jQuery('#display_stage').remove();
                jQuery('#display_stage_background').remove();

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();
            }
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});